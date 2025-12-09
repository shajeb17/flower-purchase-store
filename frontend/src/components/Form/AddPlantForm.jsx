import axios from "axios";
import { use } from "react";
import { useForm } from "react-hook-form";
import AuthProvider from "../../providers/AuthProvider";
import { AuthContext } from "../../providers/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddPlantForm = () => {
  let { user } = use(AuthContext);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (plantdata) => {
      return axios.post("http://localhost:3000/flower", plantdata);
    },
    onSuccess: () => {
      console.log("Flower Added!");
      queryClient.invalidateQueries(["flowers"]);
    },
  });

  const onSubmit = async (data) => {
    let { catagory, description, image, name, pirce, quentity } = data;
    let myImgid = image[0];
    let formData = new FormData();
    formData.append("image", myImgid);
    let myimg = await axios.post(
      `https://api.imgbb.com/1/upload?key=2eaa4cf32670faeaa0a6cca9625519cb`,
      formData
    );
    let fullImg = myimg?.data?.data?.display_url;
    let plantdata = {
      image: fullImg,
      name,
      description,
      price: Number(pirce),
      quentity: Number(quentity),
      catagory,
      seller: {
        image: user?.photoURL,
        name: user?.displayName,
        email: user?.email,
      },
    };

    try {
      mutation.mutate(plantdata);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1 text-sm">
              <label htmlFor="name" className="block text-gray-600">
                Name
              </label>
              <input
                className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                id="name"
                type="text"
                placeholder="Plant Name"
                {...register("name", { required: "please wright Plant Name" })}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>
            {/* Category */}
            <div className="space-y-1 text-sm">
              <label htmlFor="category" className="block text-gray-600 ">
                Category
              </label>
              <select
                className="w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                {...register("catagory", {
                  required: "please select one catagory",
                })}
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Succulent">Succulent</option>
                <option value="Flowering">Flowering</option>
              </select>
              {errors.catagory && (
                <span className="text-red-500">{errors.catagory.message}</span>
              )}
            </div>
            {/* Description */}
            <div className="space-y-1 text-sm">
              <label htmlFor="description" className="block text-gray-600">
                Description
              </label>

              <textarea
                id="description"
                placeholder="Write plant description here..."
                className="block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 "
                {...register("description", {
                  required: "wright plants description",
                })}
              ></textarea>
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-6 flex flex-col">
            {/* Price & Quantity */}
            <div className="flex justify-between gap-2">
              {/* Price */}
              <div className="space-y-1 text-sm">
                <label htmlFor="price" className="block text-gray-600 ">
                  Price
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  id="price"
                  type="number"
                  placeholder="Price per unit"
                  {...register("pirce", { required: "wright pirce" })}
                />
                {errors.price && (
                  <span className="text-red-500">{errors.price.message}</span>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1 text-sm">
                <label htmlFor="quantity" className="block text-gray-600">
                  Quantity
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  name="quantity"
                  id="quantity"
                  type="number"
                  placeholder="Available quantity"
                  {...register("quentity", {
                    required: "wright Available quantity",
                  })}
                />
                {errors.quentity && (
                  <span className="text-red-500">
                    {errors.quentity.message}
                  </span>
                )}
              </div>
            </div>
            {/* Image */}
            <div className=" p-4  w-full  m-auto rounded-lg grow">
              <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                <div className="flex flex-col w-max mx-auto text-center">
                  <label>
                    <input
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      id="image"
                      accept="image/*"
                      hidden
                      {...register("image", { required: "please add image" })}
                    />
                    <div className="bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500">
                      Upload
                    </div>
                    {errors.image && (
                      <span className="text-red-500">
                        {errors.image.message}
                      </span>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 "
            >
              Save & Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPlantForm;
