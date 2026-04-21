"use client";
import { assets } from "@/assets/assets";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { parseProductCategories } from "@/lib/productCategories";
import { catalogCategories } from "@/lib/catalogCategories";

export default function StoreAddProduct() {
  const categories = catalogCategories;

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    mrp: 0,
    price: 0,
    categories: [],
  });
  const [loading, setLoading] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [customCategory, setCustomCategory] = useState("");

  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const onChangeHandler = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };

  const toggleCategory = (category) => {
    setProductInfo((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((item) => item !== category)
        : [...prev.categories, category],
    }));
  };

  const addCustomCategory = () => {
    const normalizedCategory = customCategory.trim();
    if (!normalizedCategory) return;

    setProductInfo((prev) => ({
      ...prev,
      categories: prev.categories.includes(normalizedCategory)
        ? prev.categories
        : [...prev.categories, normalizedCategory],
    }));
    setCustomCategory("");
  };

  const handleImageUpload = async (key, file) => {
    setImages((prev) => ({ ...prev, [key]: file }));

    if (key === "1" && file && !aiUsed) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1];
        const mimeType = file.type;
        const token = await getToken();

        try {
          await toast.promise(
            axios.post(
              "/api/store/ai",
              { base64Image: base64String, mimeType },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            {
              loading: "Analyzing image with AI...",
              success: (res) => {
                const data = res.data;
                if (data.name && data.description) {
                  setProductInfo((prev) => ({
                    ...prev,
                    name: data.name,
                    description: data.description,
                  }));
                  setAiUsed(true);
                  return "AI filled product info!";
                }
                return "AI could not analyze the image.";
              },
              error: (error) => error?.response?.data?.error || error.message,
            },
          );
        } catch (error) {
          console.error(error);
        }
      };
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (productInfo.categories.length < 1) {
        return toast.error("Select at least one category");
      }
      if (!images[1] && !images[2] && !images[3] && !images[4]) {
        if (!isEditMode || existingImages.length === 0) {
          return toast.error("Please upload at least one image");
        }
      }
      setLoading(true);

      const formData = new FormData();
      if (isEditMode) {
        formData.append("productId", editId);
      }
      formData.append("name", productInfo.name);
      formData.append("description", productInfo.description);
      formData.append("mrp", productInfo.mrp);
      formData.append("price", productInfo.price);
      productInfo.categories.forEach((category) =>
        formData.append("categories", category),
      );

      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });
      const token = await getToken();
      const { data } = await axios({
        url: "/api/store/product",
        method: isEditMode ? "put" : "post",
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);

      setProductInfo({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        categories: [],
      });
      setImages({ 1: null, 2: null, 3: null, 4: null });
      setExistingImages([]);
      setAiUsed(false);
      router.push("/store/manage-product");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
      // Logic to add a product
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!editId) return;

      try {
        const token = await getToken();
        const { data } = await axios.get(`/api/store/product?id=${editId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProductInfo({
          name: data.product.name,
          description: data.product.description,
          mrp: data.product.mrp,
          price: data.product.price,
          categories: parseProductCategories(data.product.category),
        });
        setExistingImages(data.product.images || []);
        setAiUsed(true);
      } catch (error) {
        toast.error(error?.response?.data?.error || error.message);
      }
    };

    fetchProduct();
  }, [editId, getToken]);

  return (
    <form
      onSubmit={(e) =>
        toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })
      }
      className="text-slate-500 mb-28"
    >
      <h1 className="text-2xl">
        {isEditMode ? "Edit" : "Add New"}{" "}
        <span className="text-slate-800 font-medium">Products</span>
      </h1>
      <p className="mt-7">
        Product Images
        {isEditMode && (
          <span className="ml-2 text-xs text-slate-400">
            Leave empty to keep the current images
          </span>
        )}
      </p>

      <div htmlFor="" className="flex gap-3 mt-4">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`images${key}`}>
            <Image
              width={300}
              height={300}
              className="h-15 w-auto border border-slate-200 rounded cursor-pointer"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : existingImages[key - 1] || assets.upload_area
              }
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`images${key}`}
              onChange={(e) => handleImageUpload(key, e.target.files[0])}
              hidden
            />
          </label>
        ))}
      </div>

      <label htmlFor="" className="flex flex-col gap-2 my-6 ">
        Name
        <input
          type="text"
          name="name"
          onChange={onChangeHandler}
          value={productInfo.name}
          placeholder="Enter product name"
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
          required
        />
      </label>

      <label htmlFor="" className="flex flex-col gap-2 my-6 ">
        Description
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={productInfo.description}
          placeholder="Enter product description"
          rows={5}
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none"
          required
        />
      </label>

      <div className="flex gap-5">
        <label htmlFor="" className="flex flex-col gap-2 ">
          Actual Price ($)
          <input
            type="number"
            name="mrp"
            onChange={onChangeHandler}
            value={productInfo.mrp}
            placeholder="0"
            rows={5}
            className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none"
            required
          />
        </label>
        <label htmlFor="" className="flex flex-col gap-2 ">
          Offer Price ($)
          <input
            type="number"
            name="price"
            onChange={onChangeHandler}
            value={productInfo.price}
            placeholder="0"
            rows={5}
            className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none"
            required
          />
        </label>
      </div>

      <div className="my-6 max-w-2xl">
        <p className="mb-3 text-sm font-medium">
          Categories
          <span className="ml-2 text-xs text-slate-400">
            Select one or more
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isSelected = productInfo.categories.includes(category);

            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`filter-toggle-control rounded-full border px-4 py-2 text-sm font-medium ${
                  isSelected
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex max-w-lg gap-3">
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Add a custom category like Smart Home"
            className="filter-control w-full rounded-2xl px-4 py-3 text-slate-700 outline-none"
          />
          <button
            type="button"
            onClick={addCustomCategory}
            className="control-button control-button--soft rounded-2xl px-4 py-3 text-sm font-medium"
          >
            Add
          </button>
        </div>
        {productInfo.categories.some(
          (category) => !categories.includes(category),
        ) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {productInfo.categories
              .filter((category) => !categories.includes(category))
              .map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="filter-chip inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                >
                  {category} ×
                </button>
              ))}
          </div>
        )}
      </div>

      <br />

      <button
        disabled={loading}
        className="control-button control-button--primary mt-7 rounded-2xl px-6 py-3 text-white"
      >
        {isEditMode ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}
