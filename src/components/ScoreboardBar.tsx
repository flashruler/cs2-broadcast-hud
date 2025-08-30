// import React from "react";

// type ScoreboardBarProps = {
//   ctName: string;
//   ctScore: number;
//   tName: string;
//   tScore: number;
//   round: number;
//   maxRounds: number;
//   timer: string;
//   collapsed: boolean;
// };

// export function ScoreboardBar({
//   ctName,
//   ctScore,
//   tName,
//   tScore,
//   round,
//   maxRounds,
//   timer,
//   collapsed,
// }: ScoreboardBarProps) {
//   return (
//     <div className="w-full flex items-center justify-center  text-white py-2">
//       <div className="grid grid-cols-[1fr_auto_1fr] items-center w-[1000px] h-[60px]">
//         {/* CT Side */}
//         <div
//           className={`flex items-center justify-end bg-[#2a2a2a] h-full border-l-[3px] border-blue-500 transition-all duration-500 ease-in-out`}
//         >
//           {/* Logo */}
//           <img
//             src={`${ctName} logo`}
//             alt={`${ctName} logo`}
//             className={`h-[60px] w-[60px] object-contain mr-3 transform transition-all duration-500 ${collapsed ? "translate-x-10 opacity-0" : "translate-x-0 opacity-100"
//               }`}
//           />

//           {/* Team Name (hidden when collapsed) */}
//           {!collapsed && (
//             <span className="mr-3 font-semibold transition-opacity duration-300">
//               {ctName}
//             </span>
//           )}
//         </div>

//         {/* Center Info (always visible) */}
//         <div className="w-[200px] flex flex-row items-center justify-center h-full bg-[#1e1e1e]">
//           <span className="text-3xl font-bold p-3">{ctScore}</span>
//           <div className="flex flex-col items-center justify-center">
//             <span className="text-xs uppercase tracking-wide">
//               Round {round}/{maxRounds}

//             </span>
//             <span className="text-2xl font-extrabold">{timer}</span>
//           </div>
//           <span className="text-3xl font-bold p-3">{tScore}</span>
//         </div>

//         {/* T Side */}
//         <div
//           className={`flex items-center justify-start bg-[#2a2a2a] h-full transition-all duration-500 ease-in-out overflow-hidden ${collapsed ? "w-0 opacity-0" : "px-6 w-full opacity-100"
//             }`}
//         >
//           {!collapsed && (
//             <span className="ml-3 font-semibold transition-opacity duration-300">
//               {tName}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
type ScoreboardBarProps = {
  ctName: string;
  ctScore: number;
  tName: string;
  tScore: number;
  round: number;
  maxRounds: number;
  timer: string;
  collapsed: boolean;
  ctLogoUrl: string;
  tLogoUrl: string;
};

export function ScoreboardBar({
  ctName,
  ctScore,
  tName,
  tScore,
  round,
  maxRounds,
  timer,
  collapsed,
  ctLogoUrl,
  tLogoUrl
}: ScoreboardBarProps) {
  return (
    <div className="w-full flex  justify-center text-white py-2">
      <div className="flex items-center justify-center w-[1000px] h-[60px]">
        {/* CT Block */}
        <div
          className={`flex items-center h-full bg-[#2a2a2a] transition-all duration-500 ease-in-out overflow-hidden ${
            collapsed ? "w-[100px]" : "w-[220px]"
          }`}
        >
          {/* Logo always visible */}
          <img
            src={ctLogoUrl}
            alt={`${ctName} logo`}
            className="h-[40px] w-[40px] object-contain ml-2"
          />

          {/* Blue Accent Bar (always visible) */}
          <div className="w-[4px] h-[60px] bg-blue-500 mx-2" />

          {/* Team name (collapses away) */}
          <span
            className={`font-semibold text-center flex-1 transition-all duration-200 ${
              collapsed
                ? "opacity-0 translate-x-[-20px] w-0"
                : "opacity-100 translate-x-0 w-auto"
            }`}
          >
            {ctName}
          </span>
        </div>

        {/* Center Block (scores + timer) */}
        <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] px-6">
          <div className="flex items-center space-x-6">
            {/* CT Score */}
            <span className="text-3xl font-bold">{ctScore}</span>

            {/* Timer */}
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-wide">
                Round {round}/{maxRounds}
              </span>
              <span className="text-2xl font-extrabold">{timer}</span>
            </div>

            {/* T Score */}
            <span className="text-3xl font-bold">{tScore}</span>
          </div>
        </div>

        {/* T Block */}
        <div
          className={`flex items-center justify-end h-full bg-[#2a2a2a] transition-all duration-500 ease-in-out overflow-hidden ${
            collapsed ? "w-[100px]" : "w-[220px]"
          }`}
        >
          {/* Team name (collapses away) */}
          <span
            className={`font-semibold text-center flex-1 transition-all duration-200 ${
              collapsed
                ? "opacity-0 translate-x-[20px] w-0"
                : "opacity-100 translate-x-0 w-auto"
            }`}
          >
            {tName}
          </span>

          {/* Orange Accent Bar (always visible) */}
          <div className="w-[4px] h-[60px] bg-orange-500 mx-2" />

          {/* Logo always visible */}
          <img
            src={tLogoUrl}
            alt={`${tName} logo`}
            className="h-[40px] w-[40px] object-contain mr-2"
          />
        </div>
      </div>
    </div>
  );
}