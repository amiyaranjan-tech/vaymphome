
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineClose } from "react-icons/ai";
import {
  categoriesData,
  sleeveType,
  neckType,
  color,
  fabric,
  occasion,
  fit,
  gender,
  size,
  subCategory,
  brandingData,
} from "../static/data"; // Assuming data is imported correctly

const SearchResults = () => {
  const { query } = useParams();
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    colors: [],
    sizes: [],
    brandingDatas: [],
    neckTypes: [],
    sleeveTypes: [],
    fabrics: [],
    occasions: [],
    fits: [],
    subCategorys: [],
    genders: [],
    customerRatings: [],
    priceRanges: [],
  });
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [showAllSubCategories, setShowAllSubCategories] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllNeckTypes, setShowAllNeckTypes] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    colors: false,
    sizes: false,
    subCategorys: false,
    neckTypes: false,
    fabrics: false,
    occasions: false,
    fits: false,
    sleeveTypes: false,
    brandingDatas: false,
    genders: false,
    customerRatings: false,
    priceRanges: false,
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${server}/product/get-all-searched-products`, {
        params: {
          query,
          page: currentPage,
          limit: 6,
          color: filters.colors.join(","),
          neckType: filters.neckTypes.join(","),
          sleeveType: filters.sleeveTypes.join(","),
          size: filters.sizes.join(","),
          fit: filters.fits.join(","),
          gender: filters.genders.join(","),
          occasion: filters.occasions.join(","),
          subCategory: filters.subCategorys.join(","),
          fabric: filters.fabrics.join(","),
          brandingData: filters.brandingDatas.join(","),
          customerRating: filters.customerRatings.join(","),
          priceRange: filters.priceRanges.join(","),
          sortBy,
        },
      });

      const data = response.data;
      if (data.success) {
        setFilteredData(data.products);
        setTotalPages(data.totalPages);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [query, currentPage, filters, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (type, value) => {
    const newFilters = { ...filters };
    if (newFilters[type].includes(value)) {
      newFilters[type] = newFilters[type].filter((item) => item !== value);
    } else {
      newFilters[type].push(value);
    }
    setFilters(newFilters);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDropdown = (type) => {
    setDropdowns({ ...dropdowns, [type]: !dropdowns[type] });
  };

  const toggleSortDrawer = () => {
    setSortDrawerOpen(!sortDrawerOpen);
  };

  const toggleShowAll = (type) => {
    switch (type) {
      case "sizes":
        setShowAllSizes(!showAllSizes);
        break;
      case "subCategorys":
        setShowAllSubCategories(!showAllSubCategories);
        break;
      case "colors":
        setShowAllColors(!showAllColors);
        break;
      case "neckTypes":
        setShowAllNeckTypes(!showAllNeckTypes);
        break;
      default:
        break;
    }
  };


  const visibleSizes = showAllSizes ? size : size.slice(0, 6);
  const visibleSubCategories = showAllSubCategories ? subCategory : subCategory.slice(0, 6);
  const visibleColors = showAllColors ? color : color.slice(0, 6);
  const visibleNeckTypes = showAllNeckTypes ? neckType : neckType.slice(0, 6);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div>
          <Header activeHeading={3} />
          <div className={`${styles.section}`}>
            <div className="flex items-center mb-4">
              <button
                className="p-2 bg-blue-500 text-white"
                onClick={toggleDrawer}
              >
                Filter
              </button>
              <select
                className="ml-4 p-2 border bg-white"
                onChange={handleSortChange}
                value={sortBy}
              >
                <option value="">Sort By</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="date-asc">Date: Old to New</option>
                <option value="date-desc">Date: New to Old</option>
              </select>
            </div>
            <div
              className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity ${
                drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={toggleDrawer}
            ></div>
            <div
              className={`fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 overflow-y-auto transition-transform transform ${
                drawerOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
               <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filter Options</h2>
              <AiOutlineClose className="cursor-pointer" onClick={toggleDrawer} />
            </div>
              <form onSubmit={handleFilterSubmit}>
                {/* Color Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("colors")}
                  >
                    Color
                    {dropdowns.colors ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.colors &&
                    visibleColors.map((c) => (
                      <label key={c.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={c.name}
                          checked={filters.colors.includes(c.name)}
                          onChange={() => handleCheckboxChange("colors", c.name)}
                        />
                        {c.name}
                      </label>
                    ))}
                     {dropdowns.colors && color.length > 6 && (
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => toggleShowAll("colors")}
                    >
                      {showAllColors ? "See Less" : "See More"}
                    </button>
                  )}
                </div>
                {/* Size Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("sizes")}
                  >
                    Size
                    {dropdowns.sizes ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.sizes &&
                    visibleSizes.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.type}
                          checked={filters.sizes.includes(s.type)}
                          onChange={() => handleCheckboxChange("sizes", s.type)}
                        />
                        {s.type}
                      </label>
                    ))}
                     {dropdowns.sizes && size.length > 6 && (
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => toggleShowAll("sizes")}
                    >
                      {showAllSizes ? "See Less" : "See More"}
                    </button>
                  )}
                </div>
                {/* SubCategory Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("subCategorys")}
                  >
                    Category
                    {dropdowns.subCategorys ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.subCategorys &&
                        visibleSubCategories.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.title}
                          checked={filters.subCategorys.includes(s.title)}
                          onChange={() => handleCheckboxChange("subCategorys", s.title)}
                        />
                        {s.title}
                      </label>
                    ))}
                    {dropdowns.subCategorys && subCategory.length > 6 && (
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => toggleShowAll("subCategorys")}
                    >
                      {showAllSubCategories ? "See Less" : "See More"}
                    </button>
                  )}
                </div>
                {/* Neck Type Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("neckTypes")}
                  >
                    Neck Type
                    {dropdowns.neckTypes ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.neckTypes &&
                         visibleNeckTypes.map((n) => (
                      <label key={n.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={n.title}
                          checked={filters.neckTypes.includes(n.title)}
                          onChange={() => handleCheckboxChange("neckTypes", n.title)}
                        />
                        {n.title}
                      </label>
                    ))}
                     {dropdowns.neckTypes && neckType.length > 6 && (
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => toggleShowAll("neckTypes")}
                    >
                      {showAllNeckTypes ? "See Less" : "See More"}
                    </button>
                  )}
                </div>
               {/* Fabric Filter */}
               <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("fabrics")}
                  >
                    Fabric
                    {dropdowns.fabrics ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.fabrics &&
                    fabric.map((f) => (
                      <label key={f.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={f.type}
                          checked={filters.fabrics.includes(f.type)}
                          onChange={() => handleCheckboxChange("fabrics", f.type)}
                        />
                        {f.type}
                      </label>
                    ))}
                </div>
                {/* Occasion Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("occasions")}
                  >
                    Occasion
                    {dropdowns.occasions ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.occasions &&
                    occasion.map((o) => (
                      <label key={o.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={o.type}
                          checked={filters.occasions.includes(o.type)}
                          onChange={() => handleCheckboxChange("occasions", o.type)}
                        />
                        {o.type}
                      </label>
                    ))}
                </div>
                {/* Fit Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("fits")}
                  >
                    Fit
                    {dropdowns.fits ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.fits &&
                    fit.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.type}
                          checked={filters.fits.includes(s.type)}
                          onChange={() => handleCheckboxChange("fits", s.type)}
                        />
                        {s.type}
                      </label>
                    ))}
                </div>
                {/* Sleeve Type Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("sleeveTypes")}
                  >
                    Sleeve Type
                    {dropdowns.sleeveTypes ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.sleeveTypes &&
                    sleeveType.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.title}
                          checked={filters.sleeveTypes.includes(s.title)}
                          onChange={() => handleCheckboxChange("sleeveTypes", s.title)}
                        />
                        {s.title}
                      </label>
                    ))}
                </div>
                {/* Branding Data Filter
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("brandingDatas")}
                  >
                    Branding
                    {dropdowns.brandingDatas ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.brandingDatas &&
                    brandingData.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.title}
                          checked={filters.brandingDatas.includes(s.title)}
                          onChange={() => handleCheckboxChange("brandingDatas", s.title)}
                        />
                        {s.title}
                      </label>
                    ))}
                </div> */}
                {/* Gender Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("genders")}
                  >
                    Gender
                    {dropdowns.genders ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.genders &&
                    gender.map((s) => (
                      <label key={s.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={s.type}
                          checked={filters.genders.includes(s.type)}
                          onChange={() => handleCheckboxChange("genders", s.type)}
                        />
                        {s.type}
                      </label>
                    ))}
                </div>
                {/* Customer Ratings Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("customerRatings")}
                  >
                    Customer Rating
                    {dropdowns.customerRatings ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.customerRatings &&
                    [1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="block ml-2">
                        <input
                          type="checkbox"
                          value={rating}
                          checked={filters.customerRatings.includes(rating)}
                          onChange={() => handleCheckboxChange("customerRatings", rating)}
                        />
                        {rating} Stars
                      </label>
                    ))}
                </div>
                {/* Price Range Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("priceRanges")}
                  >
                    Price Range
                    {dropdowns.priceRanges ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.priceRanges &&
                    [
                      { id: 1, range: "0-500" },
                      { id: 2, range: "500-1000" },
                      { id: 3, range: "1000-2000" },
                      { id: 4, range: "2000+" },
                    ].map((range) => (
                      <label key={range.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={range.range}
                          checked={filters.priceRanges.includes(range.range)}
                          onChange={() => handleCheckboxChange("priceRanges", range.range)}
                        />
                        Rs.{range.range}
                      </label>
                    ))}
                </div>
                {/* <button type="submit" className="bg-blue-500 text-white py-2 px-4 mt-4">
                  Apply Filters
                </button> */}
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((product) => (
                <ProductCard data={product} key={product._id} />
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default SearchResults;



// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";
// import Header from "../components/Layout/Header";
// import Footer from "../components/Layout/Footer";
// import ProductCard from "../components/Route/ProductCard/ProductCard";
// import Loader from "../components/Layout/Loader";
// import styles from "../styles/styles";
// import axios from "axios";
// import { server } from "../server";
// import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineClose } from "react-icons/ai";
// import {
//   categoriesData,
//   sleeveType,
//   neckType,
//   color,
//   fabric,
//   occasion,
//   fit,
//   gender,
//   size,
//   subCategory,
//   brandingData,
// } from "../static/data"; // Assuming data is imported correctly

// const SearchResults = () => {
//   const { query } = useParams();
//   const [filteredData, setFilteredData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [filters, setFilters] = useState({
//     colors: [],
//     sizes: [],
//     brandingDatas: [],
//     neckTypes: [],
//     sleeveTypes: [],
//     fabrics: [],
//     occasions: [],
//     fits: [],
//     subCategorys: [],
//     genders: [],
//     customerRatings: [],
//     priceRanges: [],
//   });
//   const [sortBy, setSortBy] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(`${server}/product/get-all-searched-products`, {
//         params: {
//           query,
//           page: currentPage,
//           limit: 6,
//           color: filters.colors.join(","),
//           neckType: filters.neckTypes.join(","),
//           sleeveType: filters.sleeveTypes.join(","),
//           size: filters.sizes.join(","),
//           fit: filters.fits.join(","),
//           gender: filters.genders.join(","),
//           occasion: filters.occasions.join(","),
//           subCategory: filters.subCategorys.join(","),
//           fabric: filters.fabrics.join(","),
//           brandingData: filters.brandingDatas.join(","),
//           customerRating: filters.customerRatings.join(","),
//           priceRange: filters.priceRanges.join(","),
//           sortBy,
//         },
//       });

//       const data = response.data;
//       console.log("data", data.products);
//       if (data.success) {
//         setFilteredData(data.products);
//         setTotalPages(data.totalPages);
//       } else {
//         setError("Failed to fetch products");
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [query, currentPage, filters, sortBy]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleCheckboxChange = (type, value) => {
//     const newFilters = { ...filters };
//     if (newFilters[type].includes(value)) {
//       newFilters[type] = newFilters[type].filter((item) => item !== value);
//     } else {
//       newFilters[type].push(value);
//     }
//     setFilters(newFilters);
//   };

//   const handleSortChange = (e) => {
//     setSortBy(e.target.value);
//   };

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);
//     fetchProducts();
//   };

//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : error ? (
//         <div className="text-center text-red-500">{error}</div>
//       ) : (
//         <div>
//           <Header activeHeading={3} />
//           <div className={`${styles.section}`}>
//             <div className="flex items-center mb-4">
//               <button
//                 className="p-2 bg-blue-500 text-white"
//                 onClick={toggleDrawer}
//               >
//                 Filter
//               </button>
//               <select
//                 className="ml-4 p-2 border bg-white"
//                 onChange={handleSortChange}
//                 value={sortBy}
//               >
//                 <option value="">Sort By</option>
//                 <option value="price-asc">Price: Low to High</option>
//                 <option value="price-desc">Price: High to Low</option>
//                 <option value="rating-asc">Rating: Low to High</option>
//                 <option value="rating-desc">Rating: High to Low</option>
//                 <option value="date-asc">Date: Old to New</option>
//                 <option value="date-desc">Date: New to Old</option>
//               </select>
//             </div>
//             <div
//               className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
//               onClick={toggleDrawer}
//             ></div>
//             <div
//               className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 overflow-y-auto transition-transform transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
//             >
//               <button className="mb-4 text-gray-500" onClick={toggleDrawer}>
//                 Close
//               </button>
//               <form onSubmit={handleFilterSubmit}>
//                 {/* Color Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Color</h3>
//                   {color.map((c) => (
//                     <label key={c.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={c.name}
//                         checked={filters.colors.includes(c.name)}
//                         onChange={() => handleCheckboxChange("colors", c.name)}
//                       />
//                       {c.name}
//                     </label>
//                   ))}
//                 </div>
//                 {/* Size Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Size</h3>
//                   {size.map((s) => (
//                     <label key={s.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={s.type}
//                         checked={filters.sizes.includes(s.type)}
//                         onChange={() => handleCheckboxChange("sizes", s.type)}
//                       />
//                       {s.type}
//                     </label>
//                   ))}
//                 </div>
//                 {/* SubCategory Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">SubCategory</h3>
//                   {subCategory.map((s) => (
//                     <label key={s.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={s.title}
//                         checked={filters.subCategorys.includes(s.title)}
//                         onChange={() => handleCheckboxChange("subCategorys", s.title)}
//                       />
//                       {s.title}
//                     </label>
//                   ))}
//                 </div>
//                 {/* Neck Type Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Neck Type</h3>
//                   {neckType.map((s) => (
//                     <label key={s.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={s.title}
//                         checked={filters.neckTypes.includes(s.title)}
//                         onChange={() => handleCheckboxChange("neckTypes", s.title)}
//                       />
//                       {s.title}
//                     </label>
//                   ))}
//                 </div>
//                 {/* Fabric Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Fabric</h3>
//                   {fabric.map((s) => (
//                     <label key={s.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={s.type}
//                         checked={filters.fabrics.includes(s.type)}
//                         onChange={() => handleCheckboxChange("fabrics", s.type)}
//                       />
//                       {s.type}
//                     </label>
//                   ))}
//                 </div>
//                 {/* Occasion Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Occasion</h3>
//                   {occasion.map((s) => (
//                     <label key={s.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={s.type}
//                         checked={filters.occasions.includes(s.type)}
//                         onChange={() => handleCheckboxChange("occasions", s.type)}
//                       />
//                       {s.type}
//                     </label>
//                   ))}
//                 </div>
//                 {/* Fit Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Fit</h3>
//                   {fit.map((s) => (
//                     <label key={s.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={s.type}
//                         checked={filters.fits.includes(s.type)}
//                         onChange={() => handleCheckboxChange("fits", s.type)}
//                       />
//                       {s.type}
//                     </label>
//                   ))}
//                 </div>
//                 {/* Sleeve Type Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Sleeve Type</h3>
//                   {sleeveType.map((s) => (
//                     <label key={s.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={s.title}
//                         checked={filters.sleeveTypes.includes(s.title)}
//                         onChange={() => handleCheckboxChange("sleeveTypes", s.title)}
//                       />
//                       {s.title}
//                     </label>
//                   ))}
//                 </div>
//                 {/* Branding Data Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Branding</h3>
//                   {brandingData.map((s) => (
//                     <label key={s.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={s.title}
//                         checked={filters.brandingDatas.includes(s.title)}
//                         onChange={() => handleCheckboxChange("brandingDatas", s.title)}
//                       />
//                       {s.title}
//                     </label>
//                   ))}
//                 </div>
//                 {/* Gender Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Gender</h3>
//                   {gender.map((s) => (
//                     <label key={s.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={s.type}
//                         checked={filters.genders.includes(s.type)}
//                         onChange={() => handleCheckboxChange("genders", s.type)}
//                       />
//                       {s.type}
//                     </label>
//                   ))}
//                 </div>
//                 {/* Customer Ratings Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Customer Rating</h3>
//                   {[1, 2, 3, 4, 5].map((rating) => (
//                     <label key={rating} className="block">
//                       <input
//                         type="checkbox"
//                         value={rating}
//                         checked={filters.customerRatings.includes(rating)}
//                         onChange={() => handleCheckboxChange("customerRatings", rating)}
//                       />
//                       {rating} Stars
//                     </label>
//                   ))}
//                 </div>
//                 {/* Price Range Filter */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold mb-2">Price Range</h3>
//                   {[
//                     { id: 1, range: "0-20" },
//                     { id: 2, range: "20-50" },
//                     { id: 3, range: "50-100" },
//                     { id: 4, range: "100+" },
//                   ].map((range) => (
//                     <label key={range.id} className="block">
//                       <input
//                         type="checkbox"
//                         value={range.range}
//                         checked={filters.priceRanges.includes(range.range)}
//                         onChange={() => handleCheckboxChange("priceRanges", range.range)}
//                       />
//                       ${range.range}
//                     </label>
//                   ))}
//                 </div>
//                 <button type="submit" className="bg-blue-500 text-white py-2 px-4 mt-4">
//                   Apply Filters
//                 </button>
//               </form>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredData.map((product) => (
//                 <ProductCard data={product} key={product._id} />
//               ))}
//             </div>
//             <div className="mt-4">
//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index}
//                   className={`px-4 py-2 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : ''}`}
//                   onClick={() => handlePageChange(index + 1)}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <Footer />
//         </div>
//       )}
//     </>
//   );
// };

// export default SearchResults;

