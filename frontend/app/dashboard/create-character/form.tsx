"use client";
import { createCharacter } from "@/app/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, MutableRefObject } from "react";

interface Skill {
    id: number;
    pic: string | null;
    title: string | null;
    description: string | null;
}

export default function CharacterCreationForm() {
    const [error, setError] = useState(false);
    // Define refs as possibly null
    const nameRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const titleRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const universeRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const descriptionRef: MutableRefObject<HTMLInputElement | null> =
        useRef(null);

    const [coverPic, setCoverPic] = useState("");
    const [coverBg, setCoverBg] = useState("");
    const [showCoverPic, setShowCoverPic] = useState(false);
    const [showCoverBg, setShowCoverBg] = useState(false);
    const [skillSets, setSkillSets] = useState([
        {
            id: Math.random(),
            pic: "",
            title: "",
            description: "",
        },
    ]);
    function stripIdAttributes(skills: Array<Skill>) {
        return skills.map((obj) => {
            const { id, ...rest } = obj;
            return rest;
        });
    }
    function getCharacterData() {
        const myCharacter = {
            name: nameRef.current?.value,
            title: titleRef.current?.value,
            description: descriptionRef.current?.value,
            universe: universeRef.current?.value,
            cover_pic: coverPic,
            cover_bg: coverBg,
            skills: stripIdAttributes(skillSets),
        };
        return myCharacter;
    }
    const router = useRouter();
    return (
        <form
            action={async () => {
                let response = await createCharacter(getCharacterData());
                if (response.status == 200) {
                    console.log(response.characterData);
                    router.push("/dashboard");
                } else {
                    setError(true);
                }
            }}
            className="grid gap-4 w-[1200px] place-items-center"
        >
            <div className="bg-gray-900 rounded-lg mt-8 p-4 w-full">
                <div className="grid w-full grid-cols-3 gap-4">
                    <div className="">
                        <h2 className="text-white text-lg mb-4 font-bold">
                            Character Details
                        </h2>
                        <div className="grid gap-4">
                            <input
                                ref={nameRef}
                                type="text"
                                placeholder="Name"
                                className="w-full text-lg text-white px-2 py-1 bg-gray-800 rounded-md focus:outline-none focus:outline-emerald-500"
                            />
                            <input
                                ref={titleRef}
                                type="text"
                                placeholder="Title"
                                className="w-full text-lg text-white px-2 py-1 bg-gray-800 rounded-md focus:outline-none focus:outline-emerald-500"
                            />
                            <input
                                ref={universeRef}
                                type="text"
                                placeholder="Universe"
                                className="w-full text-lg text-white px-2 py-1 bg-gray-800 rounded-md focus:outline-none focus:outline-emerald-500"
                            />
                            <input
                                ref={descriptionRef}
                                type="text"
                                placeholder="Description..."
                                className="w-full text-lg text-white px-2 py-1 bg-gray-800 rounded-md focus:outline-none focus:outline-emerald-500"
                            />

                            <input
                                defaultValue={coverPic}
                                onChange={(event) => {
                                    setCoverPic(event.target.value);
                                    setShowCoverPic(true);
                                    console.log(coverPic);
                                }}
                                type="text"
                                placeholder="Cover Picture"
                                className="w-full text-lg text-white px-2 py-1 bg-gray-800 rounded-md focus:outline-none focus:outline-emerald-500"
                            />
                            {showCoverPic && (
                                <div className="w-full">
                                    <Image
                                        src={coverPic}
                                        onError={() => {
                                            setShowCoverPic(false);
                                        }}
                                        alt="Cover Picture"
                                        width={200}
                                        height={200}
                                    />
                                </div>
                            )}
                            <input
                                defaultValue={coverBg}
                                onChange={(event) => {
                                    setCoverBg(event.target.value);
                                    setShowCoverBg(true);
                                    console.log(coverBg);
                                }}
                                type="text"
                                placeholder="Cover Background"
                                className="w-full text-lg text-white px-2 py-1 bg-gray-800 rounded-md focus:outline-none focus:outline-emerald-500"
                            />
                            {showCoverBg && (
                                <div className="w-full">
                                    <Image
                                        src={coverBg}
                                        onError={() => {
                                            setShowCoverBg(false);
                                        }}
                                        alt="Cover Picture"
                                        width={200}
                                        height={200}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-white text-lg font-bold">
                                Abilities - {skillSets.length}
                            </h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setSkillSets([
                                        ...skillSets,
                                        {
                                            id: Math.random(),
                                            pic: "",
                                            title: "",
                                            description: "",
                                        },
                                    ]);
                                }}
                                className="text-white bg-emerald-500 px-3 py-1 rounded-md"
                            >
                                Add Skill
                            </button>
                        </div>
                        <div className="h-[600px] overflow-auto">
                            <ul className="grid gap-4 rounded-lg">
                                {skillSets?.map((skill) => {
                                    return (
                                        <li
                                            className="grid gap-4 p-4 rounded-lg bg-gray-800"
                                            key={skill.id}
                                        >
                                            <input
                                                defaultValue={skill.title}
                                                onChange={(event) => {
                                                    const newSkillSets =
                                                        skillSets.map(
                                                            (_skill) => {
                                                                if (
                                                                    skill.id ==
                                                                    _skill.id
                                                                ) {
                                                                    _skill.title =
                                                                        event.target.value;
                                                                }
                                                                return _skill;
                                                            }
                                                        );
                                                    setSkillSets(newSkillSets);
                                                }}
                                                type="text"
                                                placeholder="Title"
                                                className="w-full text-lg text-white px-2 py-1 bg-gray-900 rounded-md focus:outline-none focus:outline-emerald-500"
                                            />
                                            <div className="ml-8 grid gap-4">
                                                <input
                                                    defaultValue={
                                                        skill.description
                                                    }
                                                    onChange={(event) => {
                                                        const newSkillSets =
                                                            skillSets.map(
                                                                (_skill) => {
                                                                    if (
                                                                        skill.id ==
                                                                        _skill.id
                                                                    ) {
                                                                        _skill.description =
                                                                            event.target.value;
                                                                    }
                                                                    return _skill;
                                                                }
                                                            );
                                                        setSkillSets(
                                                            newSkillSets
                                                        );
                                                    }}
                                                    type="text"
                                                    placeholder="Description"
                                                    className="w-full text-lg text-white px-2 py-1 bg-gray-900 rounded-md focus:outline-none focus:outline-emerald-500"
                                                />
                                                <input
                                                    defaultValue={skill.pic}
                                                    onChange={(event) => {
                                                        const newSkillSets =
                                                            skillSets.map(
                                                                (_skill) => {
                                                                    if (
                                                                        skill.id ==
                                                                        _skill.id
                                                                    ) {
                                                                        _skill.pic =
                                                                            event.target.value;
                                                                    }
                                                                    return _skill;
                                                                }
                                                            );
                                                        setSkillSets(
                                                            newSkillSets
                                                        );
                                                    }}
                                                    type="text"
                                                    placeholder="Picture"
                                                    className="w-full text-lg text-white px-2 py-1 bg-gray-900 rounded-md focus:outline-none focus:outline-emerald-500"
                                                />
                                            </div>
                                            <div
                                                onClick={() => {
                                                    const newSkillSets =
                                                        skillSets.filter(
                                                            (_skill) =>
                                                                _skill.id !==
                                                                skill.id
                                                        );
                                                    setSkillSets(newSkillSets);
                                                    console.log(skillSets);
                                                }}
                                                className="flex w-full justify-end"
                                            >
                                                <button
                                                    type="button"
                                                    className="text-white bg-red-500 px-3 py-1 rounded-md"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                {error && (
                    <p className="text-red-500">Wrong email or password</p>
                )}
                <div className="flex w-full justify-end mt-4">
                    <button
                        type="submit"
                        className="text-lg text-white bg-emerald-500 px-3 py-1 rounded-md"
                    >
                        Create
                    </button>
                </div>
            </div>
        </form>
    );
}
