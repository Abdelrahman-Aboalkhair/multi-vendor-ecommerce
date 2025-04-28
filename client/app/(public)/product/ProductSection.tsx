"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@/app/types/productTypes";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ProductCard from "./ProductCard";
import { useQuery } from "@apollo/client";
import { DocumentNode } from "graphql";

interface ProductSectionProps {
  title: string;
  query: DocumentNode;
  showTitle?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  query,
  showTitle = false,
}) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const pageSize = 8;

  const { data, loading, error, fetchMore } = useQuery(query, {
    variables: { first: pageSize, skip: 0 },
  });

  useEffect(() => {
    let isMounted = true;
    if (data && isMounted) {
      const products =
        data.products?.products ||
        data.newProducts?.products ||
        data.featuredProducts?.products ||
        data.trendingProducts?.products ||
        data.bestSellerProducts?.products ||
        [];
      setDisplayedProducts(products);
      setHasMore(data?.[Object.keys(data)[0]]?.hasMore || false);
    }
    return () => {
      isMounted = false;
    };
  }, [data]);

  console.log("data => ", data);

  const noProductsFound = displayedProducts.length === 0 && !loading && !error;

  const handleShowMore = () => {
    setIsFetchingMore(true);
    const newSkip = skip + pageSize;
    fetchMore({
      variables: { first: pageSize, skip: newSkip },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const queryKey = Object.keys(fetchMoreResult)[0];
        const newProducts = fetchMoreResult[queryKey].products;
        const newHasMore = fetchMoreResult[queryKey].hasMore;

        setDisplayedProducts((prevProducts) => [
          ...prevProducts,
          ...newProducts,
        ]);
        setSkip(newSkip);
        setHasMore(newHasMore);
        setIsFetchingMore(false);

        return {
          [queryKey]: {
            ...fetchMoreResult[queryKey],
            products: [...prev[queryKey].products, ...newProducts],
          },
        };
      },
    });
  };

  const handleShowLess = () => {
    setDisplayedProducts(displayedProducts.slice(0, pageSize));
    setSkip(0);
    setHasMore(data?.[Object.keys(data)[0]]?.hasMore || false);
  };

  return (
    <div className="w-full p-12">
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-[2rem]"
        >
          {showTitle && (
            <div className="flex items-center space-x-3">
              <div className="h-6 w-1 rounded-full bg-primary"></div>
              <span className="ml-2 text-xl font-extrabold font-sans tracking-wide text-gray-700 capitalize">
                {title}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {loading && !displayedProducts.length && (
        <div className="text-center py-12">
          <Package
            size={48}
            className="mx-auto text-gray-400 mb-4 animate-pulse"
          />
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-12">
          <p className="text-lg text-red-500">Error loading products</p>
        </div>
      )}
      {noProductsFound && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">No products found</p>
        </div>
      )}

      {/* Product Grid */}
      {!noProductsFound && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.map((product: Product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  hoveredProductId={hoveredProductId}
                  setHoveredProductId={setHoveredProductId}
                />
              </motion.div>
            ))}
          </div>

          {(hasMore || displayedProducts.length > pageSize) && (
            <div className="mt-8 text-center space-x-4">
              {hasMore && (
                <button
                  onClick={handleShowMore}
                  disabled={isFetchingMore}
                  className={`bg-primary text-white px-8 py-3 rounded transition-colors duration-300 font-medium ${
                    isFetchingMore ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isFetchingMore ? "Loading..." : "Show More"}
                </button>
              )}
              {displayedProducts.length > pageSize && (
                <button
                  onClick={handleShowLess}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded transition-colors duration-300 font-medium"
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSection;
