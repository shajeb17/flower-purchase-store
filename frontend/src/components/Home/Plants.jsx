import Card from "./Card";
import Container from "../Shared/Container";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../Shared/LoadingSpinner";

const Plants = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axios("http://localhost:3000/flower");
      return res.data;
    },
  });
  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <Container>
      <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {data.map((allData) => (
          <Card allData={allData} key={allData._id}></Card>
        ))}
      </div>
    </Container>
  );
};

export default Plants;
