import { useParams, useNavigate } from "react-router-dom";
import { useCountry } from "@/hooks/useCountry";
import CountryDetail from "@/components/CountryDetail/CountryDetail";
import Button from "@/components/Button/Button";
import { BsArrowLeft } from "react-icons/bs";

function CountryDetailPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { country, borderCountries } = useCountry(code);

  if (!country) {
    return (
      <div className="flex justify-center">
      <div className="w-fit flex flex-col items-center gap-16 md:gap-14 lg:gap-20 pbs-10 pbe-13.5 md:pbe-16 xl:px-20.25">
        <p className="text-sm md:text-[2rem] font-extrabold">Country not found.</p>
        <Button onClick={() => navigate("/")}>
          <BsArrowLeft className="inline-block" /> Back
        </Button>
      </div>
    </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-fit flex flex-col items-start gap-16 md:gap-14 lg:gap-20 pbs-10 pbe-13.5 md:pbe-16 xl:px-20.25">
        <Button onClick={() => navigate(-1)}>
          <BsArrowLeft /> Back
        </Button>
        <CountryDetail country={country} borderCountries={borderCountries} />
      </div>
    </div>
  );
}

export default CountryDetailPage;
