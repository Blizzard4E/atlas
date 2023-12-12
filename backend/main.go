package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB
var err error

func generateSessionToken() (string, error) {
	// Generate a random byte slice for the token
	token := make([]byte, 32)
	_, err := rand.Read(token)
	if err != nil {
		return "", err
	}

	// Encode the random bytes into a base64 string
	sessionToken := base64.URLEncoding.EncodeToString(token)
	return sessionToken, nil
}

func main() {

	// MySQL database connection parameters
	db, err = sql.Open("mysql", "root:root@tcp(localhost:3306)/atlas")
	if err != nil {
		log.Fatal("Could not connect to the database:", err)
	}
	defer db.Close() // close DB if main ends

	// Check if the connection is successful
	err = db.Ping()
	if err != nil {
		log.Fatal("Error while pinging database:", err)
	}

	log.Println("Connected to the database!")

	// Initialize Gin
	router := gin.Default()

	// Define a GET endpoint
	router.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, welcome to the Gin API!",
		})
	})

	router.POST("/sign-up", func(c *gin.Context) {
		var requestBody struct {
			Username string `json:"username"`
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid request",
			})
			return
		}

		// Check if the email already exists in the database
		var emailExists bool
		err := db.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE email = ?)", requestBody.Email).Scan(&emailExists)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking email existence"})
			return
		}

		if emailExists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email is already in use"})
			return
		}

		stmt, err := db.Prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error1": err.Error()})
			return
		}
		defer stmt.Close()

		_, err = stmt.Exec(requestBody.Username, requestBody.Email, requestBody.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error2": err.Error()})
			return
		}
		var userID int
		var username, userEmail string

		err = db.QueryRow("SELECT id, username, email FROM users WHERE email = ? AND password = ?", requestBody.Email, requestBody.Password).Scan(&userID, &username, &userEmail)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Authentication failed",
			})
		} else {
			// Simulated user data
			user := gin.H{
				"id":       userID,
				"username": username,
				"email":    userEmail,
			}

			// Create a new session token
			sessionID, err := createOrUpdateSession(userID)
			if err != nil {
				// Handle the error
				fmt.Println("Error creating session:", err)
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "Failed creating session",
				})
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"message":   "Authentication successful",
				"sessionID": sessionID,
				"user":      user,
			})
		}

		log.Println(http.StatusCreated, gin.H{"message": "User created successfully"})
	})

	router.POST("/login", func(c *gin.Context) {
		var requestBody struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid request",
			})
			return
		}

		email := requestBody.Email
		password := requestBody.Password

		if email == "" || password == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Email and password are required",
			})
			return
		}

		isAuthenticated := false

		var userID int
		var username, userEmail string

		// Perform the query to fetch user data based on email and password
		err := db.QueryRow("SELECT id, username, email FROM users WHERE email = ? AND password = ?", email, password).Scan(&userID, &username, &userEmail)
		if err != nil {
			// Handle query execution error or invalid credentials
			isAuthenticated = false // Set isAuthenticated to false if the query fails or credentials are invalid
			// Handle unsuccessful authentication
		} else {
			// Set isAuthenticated to true after successful query
			isAuthenticated = true // Set isAuthenticated to true after successfully querying user data
			// Use userID, username, and userEmail retrieved from the database if authentication is successful
		}

		if isAuthenticated {
			// Simulated user data
			user := gin.H{
				"id":       userID,
				"username": username,
				"email":    userEmail,
			}

			// Create a new session token
			sessionID, err := createOrUpdateSession(userID)
			if err != nil {
				// Handle the error
				fmt.Println("Error creating session:", err)
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "Failed creating session",
				})
				return
			}
			c.JSON(http.StatusOK, gin.H{
				"message":   "Authentication successful",
				"sessionID": sessionID,
				"user":      user,
			})
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Authentication failed",
			})
		}
	})

	router.GET("/users", getUsers)

	router.GET("/user-info", func(c *gin.Context) {
		sessionID, err := c.Cookie("session_id")
		if err != nil || sessionID == "" {
			c.JSON(400, gin.H{"error": "No session ID found"})
			return
		}
		userInfo, err := getUserInfoFromSession(sessionID)
		if err != nil {
			c.JSON(400, gin.H{"error": "Cant get session"})
			return
		}
		c.JSON(200, userInfo)
	})

	// Handle POST request to create a new character
	router.POST("/create-character", func(c *gin.Context) {
		var requestBody struct {
			Name        string  `json:"name"`
			Title       string  `json:"title"`
			Description string  `json:"description"`
			CoverPic    string  `json:"cover_pic"`
			CoverBg     string  `json:"cover_bg"`
			Universe    string  `json:"universe"`
			Skills      []Skill `json:"skills"`
			UserID      int     `json:"user_id"`
		}

		// Assuming you receive JSON data in the request body
		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(400, gin.H{"error": "Invalid JSON"})
			return
		}

		sessionID, err := c.Cookie("session_id")
		if err != nil || sessionID == "" {
			c.JSON(400, gin.H{"error": "No session ID found"})
			return
		}
		userInfo, err := getUserInfoFromSession(sessionID)

		// Convert requestBody to Character struct
		newCharacter := Character{
			Name:        requestBody.Name,
			Title:       requestBody.Title,
			Description: requestBody.Description,
			CoverPic:    requestBody.CoverPic,
			CoverBg:     requestBody.CoverBg,
			Universe:    requestBody.Universe,
			Skills:      requestBody.Skills,
			UserID:      userInfo.ID,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}

		// Call createCharacter function to insert the new character into the database
		if err := createCharacter(newCharacter); err != nil {
			fmt.Println("Error creating character:", err)
			c.JSON(500, gin.H{"error": "Failed to create character"})
			return
		}

		c.JSON(200, gin.H{"message": "Character created successfully"})
	})

	router.GET("/characters", func(c *gin.Context) {
		rows, err := db.Query("SELECT * FROM characters")
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch characters"})
			return
		}
		defer rows.Close()
		columns, err := rows.Columns()
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch characters"})
			return
		}
		values := make([]interface{}, len(columns))
		valuePtrs := make([]interface{}, len(columns))

		var characters []map[string]interface{}
		for rows.Next() {
			for i := range columns {
				valuePtrs[i] = &values[i]
			}

			if err := rows.Scan(valuePtrs...); err != nil {
				c.JSON(500, gin.H{"error": "Failed to fetch characters"})
				return
			}

			entry := make(map[string]interface{})
			for i, colName := range columns {
				var v interface{}
				val := values[i]
				b, ok := val.([]byte)
				if ok {
					if colName == "skills" { // Check if column is "skills"
						var skillsJSON []map[string]interface{}
						if err := json.Unmarshal(b, &skillsJSON); err != nil {
							c.JSON(500, gin.H{"error": "Failed to unmarshal skills JSON"})
							return
						}
						v = skillsJSON // Assign parsed JSON to the value
					} else {
						v = string(b) // Convert []byte to string
					}
				} else {
					v = val
				}
				entry[colName] = v
			}
			characters = append(characters, entry)
		}
		c.JSON(200, characters)
	})

	// Run the server
	router.Run(":8080")
}

type Skill struct {
	Pic         string `json:"pic"`
	Title       string `json:"title"`
	Description string `json:"description"`
}
type Character struct {
	Name        string
	Title       string
	Description string
	CoverPic    string
	CoverBg     string
	Universe    string
	Skills      []Skill `json:"skills"` // Assuming skills will be stored as a string in JSON format
	UserID      int
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func createCharacter(character Character) error {
	jsonSkills, err := json.Marshal(character.Skills)

	if err != nil {
		return err
	}

	query := `
        INSERT INTO characters (name, title, description, cover_pic, cover_bg, universe, skills, user_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

	_, err = db.Exec(query, character.Name, character.Title, character.Description,
		character.CoverPic, character.CoverBg, character.Universe, jsonSkills, character.UserID, time.Now(), time.Now())

	return err
}

func createOrUpdateSession(userID int) (string, error) {
	sessionToken, err := generateSessionToken()
	if err != nil {
		return "", err
	}

	// Check if a session already exists for this user
	var existingSessionID string
	err = db.QueryRow("SELECT session_id FROM sessions WHERE user_id = ?", userID).Scan(&existingSessionID)

	if err != nil && err != sql.ErrNoRows {
		return "", err
	}

	var query string
	if existingSessionID != "" {
		// If a session exists, update the session_id
		query = "UPDATE sessions SET session_id = ? WHERE user_id = ?"
	} else {
		// If no session exists, insert a new session
		query = "INSERT INTO sessions (session_id, user_id) VALUES (?, ?)"
	}

	// Execute the appropriate query (insert or update)
	stmt, err := db.Prepare(query)
	if err != nil {
		return "", err
	}
	defer stmt.Close()

	_, err = stmt.Exec(sessionToken, userID)
	if err != nil {
		return "", err
	}

	return sessionToken, nil
}

type UserInfo struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func getUserInfoFromSession(sessionToken string) (UserInfo, error) {
	var userInfo UserInfo

	query := `
        SELECT id, username, email 
        FROM users 
        WHERE id = (SELECT user_id FROM sessions WHERE session_id = ?)
    `

	err := db.QueryRow(query, sessionToken).Scan(&userInfo.ID, &userInfo.Username, &userInfo.Email)
	if err != nil {
		return UserInfo{}, err
	}

	return userInfo, nil
}

func getUsers(c *gin.Context) {
	rows, err := db.Query("SELECT id, username, email FROM users")
	if err != nil {
		c.JSON(500, gin.H{"error": "Error querying the database"})
		return
	}
	defer rows.Close()

	var users []gin.H
	for rows.Next() {
		var id int
		var username, email string
		err := rows.Scan(&id, &username, &email)
		if err != nil {
			fmt.Println(err)
			continue
		}

		user := gin.H{
			"id":       id,
			"username": username,
			"email":    email,
		}
		users = append(users, user)
	}

	c.JSON(200, users)
}
