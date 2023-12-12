"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getCharactersAction } from "../actions";
import Link from "next/link";

interface Character {
    id: number;
    name: string | null | undefined;
    title: string | null | undefined;
    description: string | null | undefined;
    universe: string | null | undefined;
    cover_pic: string;
    cover_bg: string;
    user_id: number;
    skills: {
        pic: string | null | undefined;
        title: string | null | undefined;
        description: string | null | undefined;
    }[];
    created_at: Date; // Type for created_at
    updated_at: Date; // Type for updated_at
}

export default function Characters() {
    const [characters, setCharacters] = useState<Array<Character>>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    useEffect(() => {
        async function fetchCharacters() {
            const res = await getCharactersAction();
            setCharacters(res);
        }
        fetchCharacters(); // Correctly call the function inside useEffect

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-gray-950 w-full min-h-[100vh]">
            <nav className="fixed top-0 left-0 flex w-full justify-end p-4 z-30">
                <Link
                    className="text-md text-white bg-emerald-500 px-2 py-1 rounded-md"
                    href={"/dashboard"}
                >
                    Dashboard
                </Link>
            </nav>
            {characters && (
                <div className="relative z-20">
                    <div className="grid grid-cols-3 w-full h-[100vh]">
                        <div className="h-[100vh] relative grid place-items-center">
                            <ul className="w-full absolute top-[50%] left-[50%] translate-x-[-25%] translate-y-[-50%]">
                                {characters.map((character, index) => {
                                    return (
                                        <li
                                            key={character.id}
                                            onClick={() => {
                                                setSelectedIndex(index);
                                            }}
                                        >
                                            <h2
                                                className={[
                                                    "text-white font-bold transition-all",
                                                    index == selectedIndex
                                                        ? "text-8xl"
                                                        : "text-7xl opacity-25",
                                                ].join(" ")}
                                            >
                                                {character.name}
                                            </h2>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div>
                            <div className="w-full h-full flex flex-col justify-end">
                                {characters[selectedIndex] &&
                                    characters[selectedIndex].cover_pic && (
                                        <Image
                                            src={
                                                characters[selectedIndex]
                                                    .cover_pic
                                            }
                                            alt="Cover Picture"
                                            width={600}
                                            height={600}
                                            layout="responsive"
                                        />
                                    )}
                            </div>
                        </div>
                        <div className="w-full h-full grid place-items-center">
                            <div>
                                <h3 className="text-white font-bold text-xl text-center">
                                    {characters[selectedIndex] &&
                                        characters[selectedIndex].title}
                                </h3>
                                <p className="text-white text-md text-center">
                                    {characters[selectedIndex] &&
                                        characters[selectedIndex].description}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        {characters[selectedIndex] &&
                            characters[selectedIndex].cover_bg && (
                                <Image
                                    src={characters[selectedIndex].cover_bg}
                                    alt="Cover Picture"
                                    fill
                                    objectFit="cover"
                                    className="-z-10 opacity-10"
                                />
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}
