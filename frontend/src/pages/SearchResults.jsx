
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineClose, AiFillFilter, AiOutlineSwap  } from "react-icons/ai";
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

  const handleSortOption = (sortByOption) => {
    setSortBy(sortByOption);
    // setSortDrawerOpen(false); // Close the sort drawer after selecting an option
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

  const clearFilters = () => {
    setFilters({
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
    setCurrentPage(1);
  window.location.reload() ;
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
            {/* for MObile view */}
            <div className="flex mb-0 sticky top-28 z-10 -mx-4">
              <div className="w-1/2 p-0 m-0">
                <button
                  className="w-full bg-blue-100 flex items-center justify-center font-bold text-lg tracking-wider border-t-1 border-b-2 text-gray-700 p-3 rounded-lg mb-2 border-gray-500 transition duration-300 ease-in-out md:hidden"
                  onClick={toggleDrawer}
                >
                   <AiFillFilter className="mr-2 text-xl text-gray-800" />
                  Filter
                </button>
              </div>
              <div className="w-1/2 p-0 m-0">
                <button
                  className="w-full bg-blue-100 flex items-center justify-center font-bold text-lg tracking-wider border-t-1 border-b-2 text-gray-700 p-3 rounded-lg mb-2 border-gray-500 transition duration-300 ease-in-out md:hidden"
                  onClick={toggleSortDrawer}
                >
                   <AiOutlineSwap className="text-xl text-gray-800 mr-2" />
                  Sort
                </button>
              </div>
            </div>

            {/* for larger screen */}

    
            <div className=" bg-gray-100  rounded-full flex mb-1 mt-1 sticky top-28 z-10 justify-between items-center">
              <h4 className="text-4xl font-semibold text-gray-700 hidden md:block">New Arrivals</h4>
              <button
                className="w-1/6 font-bold text-lg bg-white text-gray-800 px-4 py-2 tracking-wider rounded-full border border-gray-300 shadow-sm space-x-2 mr-11 ml-auto hidden md:block  hover:bg-blue-100 transition duration-300 ease-in-out"
                onClick={toggleDrawer}
              >
                  <AiFillFilter className="ml-11 -mb-6 text-xl text-gray-800" />
                filter
              </button>


              <button
                className="w-1/6 font-bold text-lg bg-white text-gray-800 px-4 py-2 tracking-wider rounded-full border border-gray-300 shadow-sm hidden md:block hover:bg-blue-100 transition duration-300 ease-in-out"
                onClick={toggleSortDrawer}
              >
                   <AiOutlineSwap className=" ml-11 -mb-6 text-xl text-gray-800 mr-2" />
                Sort
              </button>
            </div>



            <div
              className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              onClick={toggleDrawer}
            ></div>
            <div
              className={`fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 overflow-y-auto transition-transform transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Filter Options</h2>
                <AiOutlineClose className="cursor-pointer" onClick={toggleDrawer} />
              </div>
              <form onSubmit={handleFilterSubmit}>
              <div className="mb-4">
                    <button
                      type="button"
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
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
                {/* Customer Rating Filter */}
                <div className="mb-4">
                  <h3
                    className="cursor-pointer flex items-center justify-between border-t-1 border-b-2 border-gray-300 text-gray-700 p-3 rounded-lg mb-2 hover:border-gray-500 transition duration-300 ease-in-out"
                    onClick={() => toggleDropdown("customerRatings")}
                  >
                    Customer Rating
                    {dropdowns.customerRatings ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                  </h3>
                  {dropdowns.customerRatings &&
                    [
                      { label: "3 and below", value: "3-and-below" },
                      { label: "3 to 4", value: "3-to-4" },
                      { label: "4 and above", value: "4-and-above" },
                    ].map((rating) => (
                      <label key={rating.id} className="block ml-2">
                        <input
                          type="checkbox"
                          value={rating.value}
                          checked={filters.customerRatings.includes(rating.value)}
                          onChange={() => handleCheckboxChange("customerRatings", rating.value)}
                        />
                        {rating.label}
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
                    ["0-50", "51-100", "101-200", "1501-1700", "700-1500"].map((range) => (
                      <label key={range} className="block ml-2">
                        <input
                          type="checkbox"
                          value={range}
                          checked={filters.priceRanges.includes(range)}
                          onChange={() => handleCheckboxChange("priceRanges", range)}
                        />
                        {`RS.${range.split('-')[0]} - Rs.${range.split('-')[1]}`}
                      </label>
                    ))}
                </div>
                   
              </form>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          {/* Sort Drawer */}
          {sortDrawerOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end">
              <div className="bg-white w-full md:w-full p-4 overflow-y-auto rounded-t-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Sort Options</h2>
                  <AiOutlineClose className="cursor-pointer" onClick={toggleSortDrawer} />
                </div>
                {/* Sorting options */}
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByPriceLowToHigh"
                      name="sortBy"
                      className="mr-2"
                      value="Price: Low to High"
                      onClick={() => handleSortOption("price-asc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByPriceLowToHigh">Price (Low to High)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByPriceHighToLow"
                      name="sortBy"
                      className="mr-2"
                      value="Price: High to Low"
                      onClick={() => handleSortOption("price-desc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByPriceHighToLow">Price (High to Low)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByRatingLowToHigh"
                      name="sortBy"
                      className="mr-2"
                      value="Rating: Low to High"
                      onClick={() => handleSortOption("rating-asc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByRatingLowToHigh">Rating (Low to High)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByRatingHighToLow"
                      name="sortBy"
                      className="mr-2"
                      value="Rating: High to Low"
                      onClick={() => handleSortOption("rating-desc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByRatingHighToLow">Rating (high to Low)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByDateOldToNew"
                      name="sortBy"
                      className="mr-2"
                      value="Date: Old to New"
                      onClick={() => handleSortOption("date-asc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByDateOldToNew">Date (Old to New)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="sortByDateNewToOld"
                      name="sortBy"
                      className="mr-2"
                      value="Date: New to Old"
                      onClick={() => handleSortOption("date-desc")}
                      onChange={toggleSortDrawer}
                    />
                    <label htmlFor="sortByDateNewToOld">Date (New to Old)</label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Footer />
        </div>
      )}
    </>
  );
};

export default SearchResults;



