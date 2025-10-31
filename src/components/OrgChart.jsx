import React, { useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
const NodeCard = ({ name, email, color, initial }) => (
  <div className="flex flex-col items-center font-sans">
    <div className="w-[200px] rounded-md shadow-lg overflow-hidden border border-gray-300">
      {/* Header */}
      <div className={`${color} text-white text-[11px] text-center py-1`}>
        Lorem Ipsum dolor
      </div>

      {/* Content Box */}
      <div className="bg-white p-3 flex flex-col items-center space-y-1">
        <div className="w-8 h-8 bg-gray-100 text-xs font-semibold flex items-center justify-center rounded-full">
          {initial}
        </div>
        <div className="text-[13px] font-semibold">{name}</div>
        <div className="text-[12px] text-gray-500">{email}</div>
      </div>
    </div>
  </div>
);

const LeafNode = ({ label }) => (
  <div className="w-6 h-6 bg-gray-100 shadow text-sm rounded-full flex items-center justify-center">
    {label}
  </div>
);

const OrgChart = () => {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="min-h-[87vh] bg-white rounded-xl">
      {/* Top Toolbar */}
      <div className="w-full flex rounded-t-xl items-center justify-between px-4 py-2 border-b border-gray-300 shadow-sm bg-white font-sans">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={zoomIn}
            className="w-10 h-7 rounded bg-gray-100 text-sm font-bold hover:bg-gray-200 text-gray-600"
          > 
           <FaPlus size={18} className="ml-2"/>
          </button>
          <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomOut}
           className="w-10 h-7 rounded bg-gray-100 text-sm font-bold hover:bg-gray-200 text-gray-600"
          >
              <FaMinus size={18} className="ml-2"/>
          </button>
        </div>

        {/* 3-dot menu */}
        <div className="text-gray-500 cursor-pointer hover:text-black">
          <BsThreeDotsVertical size={20} />
        </div>
      </div>

      {/* Org Chart */}
      <div className="flex justify-center items-start overflow-auto p-10">
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
          <Tree
            lineWidth={"2px"}
            lineColor={"#3B82F6"}
            lineBorderRadius={"12px"}
            label={
              <div className="mb-6">
                <NodeCard
                  name="Bikram Das"
                  email="email1@gmail.com"
                  color="bg-blue-600"
                  initial="B"
                />
              </div>
            }
          >
            {/* Left Node */}
            <TreeNode
              label={
                <div className="mb-6">
                  <NodeCard
                    name="Suman Paul"
                    email="email1@gmail.com"
                    color="bg-pink-500"
                    initial="S"
                  />
                </div>
              }
            >
              {["J", "K", "M", "G", "A"].map((char, idx) => (
                <TreeNode key={idx} label={<LeafNode label={char} />} />
              ))}
            </TreeNode>

            {/* Right Node */}
            <TreeNode
              label={
                <div className="mb-6">
                  <NodeCard
                    name="Ram Kumar"
                    email="email1@gmail.com"
                    color="bg-fuchsia-500"
                    initial="R"
                  />
                </div>
              }
            >
              {["J", "K", "M", "G", "A"].map((char, idx) => (
                <TreeNode key={idx} label={<LeafNode label={char} />} />
              ))}
            </TreeNode>
          </Tree>
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
