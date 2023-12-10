package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB
var err error

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

	router.POST("/login", func(c *gin.Context) {
		var requestBody struct {
			Email string `json:"email"`
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
				"id": 1,
				"username": username,
				"email": email,
			}

			// Simulated session ID
			sessionID := "your_session_id_value_here"

			c.JSON(http.StatusOK, gin.H{
				"message": "Authentication successful",
				"sessionID": sessionID,
				"user": user,
			})
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Authentication failed",
			})
		}
	})

	router.GET("/users", getUsers)

    // Run the server
    router.Run(":8080")
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
			"id": id,
			"username": username,
			"email": email,
		}
		users = append(users, user)
	}

	c.JSON(200, users)
}