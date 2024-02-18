import Link from "next/link";

const Footer = () => {
  const date = new Date();

  return (
    <footer className="bg-green w-full">
      <div className="md:flex md:flex-row-reverse md:items-start md:justify-around ">
        <div className="mt-[37px] flex flex-col items-start justify-start pl-[30px] sm:pb-[2rem] md:flex-row md:gap-[3rem] md:pl-0">
          <div>
            <h3 className="text-lg font-medium text-white lg:text-[20px]">
              Company
            </h3>
            <ul className="flex flex-col space-y-3 text-[#f2f2f2]">
              <Link href="/contactus">
                <li className=" cursor-pointer">Contact Us</li>
              </Link>

              <Link href="/zambia">
                <li className=" cursor-pointer">Zambia</li>
              </Link>
            </ul>
          </div>
          <div>
            <h3 className="mt-5 text-lg font-medium text-white md:mt-0 lg:text-[20px]">
              Resources
            </h3>

            <ul className="flex flex-col space-y-3 text-[#f2f2f2]">
              <Link
                href="https://drive.google.com/file/d/1jtE0kkYDu6c4t0pUQC_s6IEBk0nrT_rY/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <li className="mt-5 cursor-pointer">Privacy Policy</li>
              </Link>

              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://drive.google.com/file/d/1jtE0kkYDu6c4t0pUQC_s6IEBk0nrT_rY/view?usp=sharing"
                replace
              >
                <li className="cursor-pointer">Terms and Conditions</li>
              </Link>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-[72px] md:flex md:items-center md:justify-center md:gap-[2rem]">
        <h3 className="text-center text-base text-white">
          Copyright Kilimo @ <span>{date.getFullYear().toString()}</span>
        </h3>
      </div>
    </footer>
  );
};

export default Footer;
