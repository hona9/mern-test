import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { toast } from "react-toastify";
import axios from "axios";

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState([]);

  const fetchListProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/product/list"
      );

      if (response.data.success) {
        setBestSeller(
          response.data.products
            .filter((product) => product.bestSeller)
            .slice(0, 5)
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchListProducts();
  }, []);

  return (
    <div className="my-10">
      <div className="py-8 text-3xl text-center">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
          Our best sellers are a curated selection of top-rated items that have
          won over shoppers with their quality, style, and value.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
