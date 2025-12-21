"use client";

import { useParams } from "next/navigation";
import StarfieldBackground from "@/components/starfieldBackground";

export default function SubCategoryPage() {
  const params = useParams();

  const cloudName = params.cloud as string;
  const subCategoryName = params.subCategory as string;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <StarfieldBackground />
      <h1 className="text-3xl font-light mb-4">SubCategory Page</h1>

      <div className="text-lg text-gray-300">
        <p>
          <span className="text-gray-400">Cloud:</span>{" "}
          <span className="text-white">{cloudName}</span>
        </p>

        <p>
          <span className="text-gray-400">SubCategory:</span>{" "}
          <span className="text-white">{subCategoryName}</span>
        </p>
      </div>
    </div>
  );
}
