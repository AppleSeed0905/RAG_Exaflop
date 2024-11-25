"use client";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function Home() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [data, setData] = useState<{ [key: string]: any }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload_google_sheet/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sheet_url: sheetUrl }),
    });

    const result = await response.json();
    setData(result?.data);
    setLoading(false);
  };

  return (
    <main className="flex max-w-full h-screen">
      <div className="flex flex-col w-full p-5">
        <h1 className="text-2xl font-bold mb-4">Google Sheets Content</h1>
        <p className="text-gray-600">
          This is where the actual Google Sheets content would be displayed.
        </p>
        <div className="flex my-4">
          <input
            type="text"
            placeholder="input google sheet url..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-r-md"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Content"}
          </button>
        </div>
        <div className="flex w-full">
          {data.length > 0 && (
            <table className="max-w-[calc(100%-20rem)] border-collapse border border-gray-300">
              <thead className="max-w-[calc(100%-20rem)]">
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="border border-gray-300 p-2">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="max-w-[calc(100%-20rem)]">
                {data.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, idx) => (
                      <td key={idx} className="border border-gray-300 p-2">{value ? value : "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div >
      <Sidebar />
    </main >
  );
}
