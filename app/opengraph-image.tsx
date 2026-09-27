import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BetBass — Betting & Casino Comparison Directory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",padding:"70px",background:"#070714",color:"white",fontFamily:"Arial"}}>
      <div style={{fontSize:34,fontWeight:800,color:"#a78bfa",letterSpacing:2}}>BETTING SITES • ONLINE CASINOS • SPORTSBOOKS</div>
      <div style={{fontSize:86,fontWeight:900,marginTop:24}}>BetBass</div>
      <div style={{fontSize:42,fontWeight:700,marginTop:12}}>Compare platforms in one directory.</div>
      <div style={{fontSize:27,color:"#a1a1aa",marginTop:24}}>Offers • Payments • Licensing • Country availability</div>
    </div>,
    { ...size }
  );
}
