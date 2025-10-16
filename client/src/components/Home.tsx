import React, { useEffect, useState } from "react";
import { Calculator } from "lucide-react";
import TreeView from "../components/TreeView";
import { api } from "../utils/api";

type User = {
  username: string;
};

export default function Home({ user }: { user: User | null }) {
    const [posts, setPosts] = useState([]);
    const [startValue, setStartValue] = useState("");

    const loadPosts = async () => {
        const data = await api("/posts");
        setPosts(data.nodes);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    interface ApiError extends Error {
        message: string;
    }

    const handleStart = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            if (!startValue) {
                alert("Please enter a starting value.");
                return;
            }
            if (isNaN(Number(startValue))) {
                alert("Starting value must be a number.");
                return;
            }
            if (!user) {
                alert("You must be logged in to start a calculation.");
                return;
            }
            await api("/posts", {
                method: "POST",
                body: JSON.stringify({ value: parseFloat(startValue) }),
            });
            setStartValue("");
            loadPosts();
        } catch (err) {
            const error = err as ApiError;
            alert(error.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-5">
            <h1 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                <Calculator size={28} className="inline-block" /> Calculation Threads
            </h1>

            {user ? (
                <form onSubmit={handleStart} className="flex gap-2 mb-5">
                    <input
                        type="number"
                        className="border rounded p-2 flex-1"
                        placeholder="Start a new chain..."
                        value={startValue}
                        onChange={e => setStartValue(e.target.value)}
                    />
                    <button className="bg-green-600 text-white px-4 rounded cursor-pointer">
                        Start
                    </button>
                </form>
            ) : (
                <p className="text-gray-600 text-center mb-5">
                    Login to start your own calculations.
                </p>
            )}

            <TreeView data={posts} user={user} refresh={loadPosts} />
            <div className="text-center text-gray-500 text-sm mt-10 ">
                &copy; 2025 CalcChain. All rights reserved.
            </div>
        </div>
    );
}
