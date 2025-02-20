import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import logo from "public/images/logo.png";

const Logo = () => {
  // ** Hooks
  const theme = useTheme();

  return (
    <Link href={`${process.env.API_URL}`}>
      <div style={{ cursor: "pointer" }}>
        <Image src={logo} alt="BuzzNodes Logo" width={250} priority={false} />
      </div>
    </Link>
  );
};

export default Logo;
