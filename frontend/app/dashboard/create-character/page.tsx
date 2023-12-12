import CharacterCreationForm from "./form";

export default function Dashboard() {
    return (
        <div className="bg-gray-950 min-h-[100vh] w-full flex justify-center">
            <div>
                <h1 className="text-xl font-bold text-white text-center">
                    Character Creation
                </h1>
                <CharacterCreationForm />
            </div>
        </div>
    );
}
