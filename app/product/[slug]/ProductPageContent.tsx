/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  IconStar,
  IconStarFilled,
  IconCheck,
  IconShieldCheck,
  IconTruck,
  IconShoppingCart,
  IconChevronLeft,
  IconChevronRight,
  IconHome,
  IconUsers,
  IconEye,
  IconFlame,
  IconClock,
  IconMinus,
  IconPlus,
  IconUser,
  IconPhone,
  IconMapPin,
  IconLoader2,
  IconShoppingBag,
  IconLock,
  IconCash,
  IconAlignLeft,
  IconFileText,
  IconX,
} from "@tabler/icons-react";
import { formatPriceSimple } from "@/data/config";
import { useCart } from "@/context";
import { DBProduct } from "@/types/product";
import { getIconByName } from "@/data/icons";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";
import { trackViewContent, trackAddToCart, trackInitiateCheckout, trackPurchase } from "@/lib/facebook-pixel";
import CollapsibleSection from "./components/CollapsibleSection";
import CTACard from "./components/CTACard";
import AnnouncementBar from "./components/AnnouncementBar";

interface ProductPageContentProps {
  product: DBProduct;
}

export default function ProductPageContent({ product }: ProductPageContentProps) {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [activeRelatedProductSlide, setActiveRelatedProductSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState<{ icon: string; text: string; price: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderError, setOrderError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<DBProduct[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Track if InitiateCheckout has been fired
  const hasTrackedInitiateCheckout = useRef(false);

  // Sticky gallery state
  const [galleryStyle, setGalleryStyle] = useState<React.CSSProperties>({});
  const galleryRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Dynamic viewer count that changes over time
  const baseViewersCount = product.viewersCount || 12;
  const [currentViewersCount, setCurrentViewersCount] = useState(baseViewersCount);

  // Image preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Update viewers count periodically
  useEffect(() => {
    const updateViewersCount = () => {
      // Randomly vary between -3 to +5 from base count
      const variation = Math.floor(Math.random() * 9) - 3;
      const newCount = Math.max(1, baseViewersCount + variation);
      setCurrentViewersCount(newCount);
    };

    // Update every 8-15 seconds (random interval)
    const getRandomInterval = () => Math.floor(Math.random() * 7000) + 8000;

    const scheduleNextUpdate = () => {
      const interval = getRandomInterval();
      return setTimeout(() => {
        updateViewersCount();
        scheduleNextUpdate();
      }, interval);
    };

    const timeoutId = scheduleNextUpdate();

    return () => clearTimeout(timeoutId);
  }, [baseViewersCount]);

  // Track ViewContent event when product page loads
  useEffect(() => {
    trackViewContent({
      content_ids: [product._id],
      content_name: product.name,
      value: product.price,
    });
  }, [product._id, product.name, product.price]);

  // Sticky gallery scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!galleryRef.current || !placeholderRef.current) return;

      // Only apply on desktop
      if (window.innerWidth < 1024) {
        setGalleryStyle({});
        return;
      }

      const placeholder = placeholderRef.current;
      const gallery = galleryRef.current;
      const placeholderRect = placeholder.getBoundingClientRect();
      const galleryHeight = gallery.offsetHeight;
      const windowHeight = window.innerHeight;
      const topOffset = 96; // 6rem = 96px

      // Get the container bounds
      const container = placeholder.parentElement;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const containerBottom = containerRect.bottom;

      // Calculate if we should stick
      if (placeholderRect.top <= topOffset) {
        // Check if we've scrolled past the container
        if (containerBottom <= galleryHeight + topOffset) {
          // Absolute position at bottom of container
          setGalleryStyle({
            position: 'absolute',
            top: 'auto',
            bottom: 0,
            left: 0,
            right: 'auto',
            width: placeholderRect.width,
          });
        } else {
          // Fixed position
          setGalleryStyle({
            position: 'fixed',
            top: topOffset,
            left: placeholderRect.left,
            width: placeholderRect.width,
          });
        }
      } else {
        // Not sticky yet
        setGalleryStyle({});
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=50');
        if (response.ok) {
          const data = await response.json();
          const allProducts: DBProduct[] = data.products || [];
          // Filter out current product and shuffle
          const filteredProducts = allProducts
            .filter(p => p._id !== product._id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 6); // Get 6 random products (3 slides of 2 products each)
          setRelatedProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [product._id]);

  // Close preview on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewImage) {
        closeImagePreview();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [previewImage]);

  const images = product.images?.length > 0 ? product.images : [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Calculate price based on selected offer or regular price
  const effectivePrice = selectedOffer ? selectedOffer.price : product.price;
  const totalPrice = effectivePrice * quantity;
  const savings = product.originalPrice
    ? (product.originalPrice - effectivePrice) * quantity
    : 0;

  // Image preview handlers
  const openImagePreview = (images: string[], index: number) => {
    setPreviewImages(images);
    setCurrentImageIndex(index);
    setPreviewImage(images[index]);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
    setPreviewImages([]);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset'; // Re-enable scrolling
  };

  const nextPreviewImage = () => {
    const nextIndex = (currentImageIndex + 1) % previewImages.length;
    setCurrentImageIndex(nextIndex);
    setPreviewImage(previewImages[nextIndex]);
  };

  const prevPreviewImage = () => {
    const prevIndex = (currentImageIndex - 1 + previewImages.length) % previewImages.length;
    setCurrentImageIndex(prevIndex);
    setPreviewImage(previewImages[prevIndex]);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      return filled ? (
        <IconStarFilled key={i} size={18} className="text-amber-400" />
      ) : (
        <IconStar key={i} size={18} className="text-neutral-300" />
      );
    });
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: product._id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        offers: product.offers,
      },
      quantity,
      selectedOffer
    );

    // Track AddToCart event
    trackAddToCart({
      content_ids: [product._id],
      content_name: product.name,
      value: effectivePrice * quantity,
    });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormFocus = () => {
    // Track InitiateCheckout only once when user first interacts with the form
    if (!hasTrackedInitiateCheckout.current) {
      hasTrackedInitiateCheckout.current = true;
      trackInitiateCheckout({
        content_ids: [product._id],
        num_items: quantity,
        value: totalPrice,
      });
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          items: [
            {
              productId: product._id,
              productSlug: product.slug,
              productName: product.name,
              productImage: product.image,
              price: effectivePrice,
              originalPrice: product.originalPrice,
              quantity: quantity,
              selectedOffer: selectedOffer || undefined,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderSuccess(true);
        setOrderNumber(data.order.orderNumber);

        // Track Purchase event
        trackPurchase({
          value: totalPrice,
          content_ids: [product._id],
          num_items: quantity,
          content_name: `Order ${data.order.orderNumber}`,
        });

        // Reset form
        setFormData({ name: "", phone: "", address: "" });
        setQuantity(1);
        setSelectedOffer(null);
        hasTrackedInitiateCheckout.current = false; // Reset for potential next order
      } else {
        setOrderError(data.message || t("productPage.checkout.orderError"));
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setOrderError(t("productPage.checkout.orderErrorRetry"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const reviewsPerPage = 3;
  const totalPages = product.reviews ? Math.ceil(product.reviews.length / reviewsPerPage) : 0;

  const nextReview = () => {
    if (product.reviews && product.reviews.length > 0) {
      setActiveReviewIndex((prev) => (prev + 1) % totalPages);
    }
  };

  const prevReview = () => {
    if (product.reviews && product.reviews.length > 0) {
      setActiveReviewIndex((prev) => (prev - 1 + totalPages) % totalPages);
    }
  };

  const productsPerSlide = 2;
  const totalRelatedSlides = Math.ceil(relatedProducts.length / productsPerSlide);

  const nextRelatedProducts = () => {
    setActiveRelatedProductSlide((prev) => (prev + 1) % totalRelatedSlides);
  };

  const prevRelatedProducts = () => {
    setActiveRelatedProductSlide((prev) => (prev - 1 + totalRelatedSlides) % totalRelatedSlides);
  };

  return (
    <>
      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={closeImagePreview}
        >
          {/* Close Button */}
          <button
            onClick={closeImagePreview}
            className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Close preview"
          >
            <IconX size={24} strokeWidth={2.5} />
          </button>

          {/* Navigation Arrows */}
          {previewImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPreviewImage();
                }}
                className="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                aria-label="Previous image"
              >
                <IconChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPreviewImage();
                }}
                className="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                aria-label="Next image"
              >
                <IconChevronRight size={24} strokeWidth={2.5} />
              </button>
            </>
          )}

          {/* Image Counter */}
          {previewImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              {currentImageIndex + 1} / {previewImages.length}
            </div>
          )}

          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
          </div>
        </div>
      )}

      <div className="w-full">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <nav className="flex flex-wrap items-center gap-1 text-xs sm:gap-2 sm:text-sm">
            <Link
              href="/"
              className="flex items-center gap-1 text-neutral-500 transition-colors hover:text-primary"
            >
              <IconHome size={16} />
              {t("common.home")}
            </Link>
            <span className="text-neutral-300">/</span>
            <Link
              href="/shop"
              className="text-neutral-500 transition-colors hover:text-primary"
            >
              {t("shop.title")}
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="font-medium text-neutral-900 break-words">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 relative">
            {/* Left Column - Gallery Placeholder */}
            <div ref={placeholderRef} className="space-y-6">
              {/* Actual Gallery - Positioned absolutely/fixed based on scroll */}
              <div ref={galleryRef} className="space-y-6" style={galleryStyle}>
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
                {images[activeImageIndex] ? (
                  <Image
                    src={images[activeImageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                    <span className="text-neutral-400">[Product Image]</span>
                  </div>
                )}

                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute start-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white"
                    >
                      <IconChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute end-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white"
                    >
                      <IconChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Badge */}
                {product.badge && (
                  <span
                    className={`absolute start-4 top-4 rounded-full px-4 py-2 text-sm font-semibold ${
                      product.badge === "sale"
                        ? "bg-primary text-white"
                        : product.badge === "new"
                          ? "bg-secondary text-white"
                          : "bg-accent text-white"
                    }`}
                  >
                    {t(`badges.${product.badge}`)}
                  </span>
                )}

                {/* Image counter */}
                <div className="absolute bottom-4 end-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        activeImageIndex === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Social Proof */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <IconUsers size={20} className="text-primary" />
                    <span className="text-sm text-neutral-600">
                      {product.soldCount || 0} {t("productPage.social.sold")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconEye size={20} className="text-secondary" />
                    <span className="text-sm text-neutral-600">
                      {currentViewersCount} {t("productPage.urgency.viewingNow")}
                    </span>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Right Column - Info & Checkout */}
            <div className="space-y-6 pb-8">
              {/* Product Info */}
              <div className="space-y-6">
                {/* Category & Badge */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
                    {t(`categories.${product.categoryId}`)}
                  </span>
                  {product.badge && (
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        product.badge === "sale"
                          ? "bg-primary/10 text-primary"
                          : product.badge === "new"
                            ? "bg-secondary/10 text-secondary"
                            : "bg-accent/10 text-accent"
                      }`}
                    >
                      {t(`badges.${product.badge}`)}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h1 className="break-words text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="font-medium text-neutral-900">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-neutral-500">
                    ({product.reviewCount} {t("productPage.reviewsCount")})
                  </span>
                  <span className="hidden text-neutral-300 sm:inline">|</span>
                  <span className="text-neutral-500">
                    {product.soldCount || 0} {t("productPage.sold")}
                  </span>
                </div>

                {/* Price */}
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 md:gap-4">
                  <span className="text-3xl font-bold text-primary sm:text-4xl">
                    {formatPriceSimple(product.price)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-neutral-400 line-through sm:text-xl">
                        {formatPriceSimple(product.originalPrice)}
                      </span>
                      <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <>
                      <IconCheck size={20} className="text-success" />
                      <span className="text-success">
                        {t("shop.inStock")} ({product.stockCount} {t("shop.available")})
                      </span>
                    </>
                  ) : (
                    <span className="text-error">{t("shop.outOfStock")}</span>
                  )}
                </div>

                {/* Highlights */}
                {product.highlights && product.highlights.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-neutral-900">
                      {t("productPage.highlightsTitle")}
                    </h3>
                    <ul className="space-y-2">
                      {product.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <IconCheck
                            size={18}
                            className="mt-0.5 flex-shrink-0 text-primary"
                          />
                          <span className="text-neutral-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Special Offers */}
                {product.offers && product.offers.length > 0 && (
                  <div className="rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 p-4">
                    <div className="space-y-3">
                      {product.offers.map((offer, index) => {
                        const IconComponent = getIconByName(offer.icon);
                        return (
                          <div key={index} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                {IconComponent ? (
                                  <IconComponent size={20} className="text-primary" />
                                ) : (
                                  <IconCheck size={20} className="text-primary" />
                                )}
                              </div>
                              <span className="font-medium text-neutral-900">{offer.text}</span>
                            </div>
                            <span className="shrink-0 text-lg font-bold text-primary">
                              {formatPriceSimple(offer.price)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Trust badges */}
                <div className="flex flex-wrap gap-2 border-t border-neutral-100 pt-4 sm:gap-4 sm:pt-6">
                  <div className="flex items-center gap-2 text-xs text-neutral-600 sm:text-sm">
                    <IconTruck size={20} className="text-primary" />
                    {t("productPage.trust.freeShipping")}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600 sm:text-sm">
                    <IconShieldCheck size={20} className="text-primary" />
                    {t("productPage.trust.securePayment")}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600 sm:text-sm">
                    <IconCheck size={20} className="text-primary" />
                    {t("productPage.trust.guarantee")}
                  </div>
                </div>
              </div>

              {/* Urgency Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-4">
                <div className="flex items-start gap-3">
                  <IconFlame size={24} className="shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {t("productPage.urgency.lowStock")}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {t("productPage.urgency.onlyLeft", { count: product.stockCount || 10 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="p-1">
                <div id="checkout-form" className="rounded-3xl border-4 border-primary bg-primary/10 p-6 lg:p-8" style={{ boxShadow: '0 20px 50px -10px rgba(167, 49, 58, 0.3), 0 10px 30px -5px rgba(0, 0, 0, 0.2)' }}>
                {/* Header */}
                <div className="mb-6 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
                    <IconShoppingBag size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-primary sm:text-xl">
                      {t("productPage.checkout.title")}
                    </h2>
                    <p className="text-sm text-neutral-700">
                      {t("productPage.checkout.subtitle")}
                    </p>
                  </div>
                </div>

                {/* Order Success Message */}
                {orderSuccess ? (
                  <div className="rounded-2xl bg-success/10 p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                        <IconCheck size={32} className="text-success" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-success">
                      {t("checkout.success.title")}
                    </h3>
                    {orderNumber && (
                      <p className="mb-2 font-mono text-lg font-bold text-neutral-900">
                        #{orderNumber}
                      </p>
                    )}
                    <p className="mb-4 text-neutral-600">
                      {t("checkout.success.message")}
                    </p>
                    <button
                      onClick={() => setOrderSuccess(false)}
                      className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
                    >
                      {t("checkout.success.continueShopping")}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Order Summary */}
                    <div className="mb-6 rounded-2xl bg-white border-2 border-primary/20 p-4">
                      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm text-neutral-600 sm:text-base">{t("productPage.checkout.product")}</span>
                        <span className="font-medium text-neutral-900">{product.name}</span>
                      </div>

                      {/* Offer Selector */}
                      {product.offers && product.offers.length > 0 && (
                        <div className="mb-4">
                          <label className="mb-3 block text-sm font-semibold text-neutral-900">
                            {t("productPage.checkout.selectOffer")}
                          </label>
                          <div className="space-y-2.5">
                            <label
                              className={`group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border-2 p-4 transition-all duration-200 ${
                                selectedOffer === null
                                  ? "border-primary bg-white shadow-md"
                                  : "border-neutral-200 bg-white hover:border-primary/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                    selectedOffer === null
                                      ? "border-primary bg-primary"
                                      : "border-neutral-300 bg-white group-hover:border-neutral-400"
                                  }`}
                                >
                                  {selectedOffer === null && (
                                    <div className="h-2 w-2 rounded-full bg-white" />
                                  )}
                                </div>
                                <input
                                  type="radio"
                                  name="offer"
                                  checked={selectedOffer === null}
                                  onChange={() => setSelectedOffer(null)}
                                  className="sr-only"
                                />
                                <span className={`text-sm font-medium ${selectedOffer === null ? "text-neutral-900" : "text-neutral-600"}`}>
                                  {t("productPage.checkout.regularPrice")}
                                </span>
                              </div>
                              <span className={`font-bold ${selectedOffer === null ? "text-neutral-900" : "text-neutral-600"}`}>
                                {formatPriceSimple(product.price)}
                              </span>
                            </label>

                            {product.offers.map((offer, index) => {
                              const IconComponent = getIconByName(offer.icon);
                              const isSelected = selectedOffer?.text === offer.text;
                              return (
                                <label
                                  key={index}
                                  className={`group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border-2 p-4 transition-all duration-200 ${
                                    isSelected
                                      ? "border-primary bg-primary/10 shadow-md"
                                      : "border-neutral-200 bg-white hover:border-primary/50"
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="absolute inset-y-0 start-0 w-1 bg-primary" />
                                  )}
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                        isSelected
                                          ? "border-primary bg-primary"
                                          : "border-neutral-300 bg-white group-hover:border-primary/50"
                                      }`}
                                    >
                                      {isSelected && (
                                        <div className="h-2 w-2 rounded-full bg-white" />
                                      )}
                                    </div>
                                    <input
                                      type="radio"
                                      name="offer"
                                      checked={isSelected}
                                      onChange={() => setSelectedOffer(offer)}
                                      className="sr-only"
                                    />
                                    <div
                                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all ${
                                        isSelected
                                          ? "bg-primary/15"
                                          : "bg-primary/10 group-hover:bg-primary/15"
                                      }`}
                                    >
                                      {IconComponent ? (
                                        <IconComponent size={20} className={isSelected ? "text-primary" : "text-primary/80"} />
                                      ) : (
                                        <IconCheck size={20} className={isSelected ? "text-primary" : "text-primary/80"} />
                                      )}
                                    </div>
                                    <span className={`text-sm font-semibold ${isSelected ? "text-neutral-900" : "text-neutral-700"}`}>
                                      {offer.text}
                                    </span>
                                  </div>
                                  <span className={`shrink-0 text-lg font-bold ${isSelected ? "text-primary" : "text-primary/80"}`}>
                                    {formatPriceSimple(offer.price)}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Quantity Selector */}
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm text-neutral-600 sm:text-base">{t("productPage.checkout.quantity")}</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100 sm:h-8 sm:w-8"
                          >
                            <IconMinus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.min(product.stockCount || 10, quantity + 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100 sm:h-8 sm:w-8"
                          >
                            <IconPlus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-neutral-600">{t("productPage.checkout.unitPrice")}</span>
                        <span className="font-medium text-neutral-900">
                          {formatPriceSimple(effectivePrice)}
                        </span>
                      </div>

                      {savings > 0 && (
                        <div className="mb-3 flex items-center justify-between text-secondary">
                          <span>{t("productPage.checkout.savings")}</span>
                          <span className="font-medium">-{formatPriceSimple(savings)}</span>
                        </div>
                      )}

                      <div className="border-t border-neutral-200 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-neutral-900">
                            {t("productPage.checkout.total")}
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {formatPriceSimple(totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {orderError && (
                      <div className="mb-4 rounded-xl bg-error/10 p-4 text-center text-error">
                        {orderError}
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium text-neutral-700"
                        >
                          {t("productPage.checkout.name")} <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            onFocus={handleFormFocus}
                            required
                            className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pe-4 ps-12 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 sm:h-12"
                            placeholder={t("productPage.checkout.namePlaceholder")}
                          />
                          <IconUser
                            size={20}
                            className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-sm font-medium text-neutral-700"
                        >
                          {t("productPage.checkout.phone")} <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            required
                            className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pe-4 ps-12 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 sm:h-12 [&:not(:placeholder-shown)]:direction-ltr [&:not(:placeholder-shown)]:text-left"
                            placeholder={t("productPage.checkout.phonePlaceholder")}
                            style={{ direction: formData.phone ? 'ltr' : 'inherit', textAlign: formData.phone ? 'left' : 'inherit' }}
                          />
                          <IconPhone
                            size={20}
                            className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label
                          htmlFor="address"
                          className="mb-2 block text-sm font-medium text-neutral-700"
                        >
                          {t("productPage.checkout.address")} <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleFormChange}
                            required
                            rows={3}
                            className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 p-4 ps-12 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder={t("productPage.checkout.addressPlaceholder")}
                          />
                          <IconMapPin
                            size={20}
                            className="absolute start-4 top-4 text-neutral-400"
                          />
                        </div>
                      </div>

                      {/* COD Notice */}
                      <div className="flex items-center gap-3 rounded-xl bg-secondary/10 border-2 border-secondary/30 p-4">
                        <IconCash size={24} className="shrink-0 text-secondary" />
                        <p className="text-sm text-secondary-dark font-medium">
                          {t("productPage.checkout.codNotice")}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-3">
                        {/* Place Order Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting || !product.inStock}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-base font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70 sm:gap-3 sm:py-4 sm:text-lg"
                        >
                          {isSubmitting ? (
                            <>
                              <IconLoader2 size={20} className="animate-spin sm:size-6" />
                              <span className="truncate">{t("productPage.checkout.processing")}</span>
                            </>
                          ) : (
                            <>
                              <IconShoppingBag size={20} className="sm:size-6" />
                              <span className="truncate">{t("productPage.checkout.placeOrder")}</span>
                            </>
                          )}
                        </button>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          disabled={!product.inStock}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white py-3 text-base font-bold text-primary transition-all hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-3 sm:py-4 sm:text-lg"
                        >
                          <IconShoppingCart size={20} className="sm:size-6" />
                          <span className="truncate">{t("common.addToCart")}</span>
                        </button>
                      </div>

                      {/* Security Badge */}
                      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                        <IconLock size={16} />
                        <span>{t("productPage.checkout.secure")}</span>
                      </div>
                    </form>
                  </>
                )}

                {/* Guarantee */}
                {product.guaranteeDays && !orderSuccess && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-600">
                    <IconClock size={18} />
                    {product.guaranteeDays} {t("productPage.trust.days")} {t("productPage.trust.guarantee")}
                  </div>
                )}
                </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-base font-semibold text-neutral-900 sm:text-lg">
                    {t("productPage.highlightsTitle")}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {product.features.map((feature, index) => {
                      const IconComponent = getIconByName(feature.icon);
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            {IconComponent ? (
                              <IconComponent size={20} className="text-primary" />
                            ) : (
                              <IconCheck size={20} className="text-primary" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-900">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-neutral-600">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Collapsible Sections */}
              <div className="space-y-4">
                {/* Short Description */}
                {product.shortDescription && (
                  <CollapsibleSection
                    title={t("productPage.sections.shortDescription")}
                    content={product.shortDescription}
                    defaultOpen={true}
                    icon={IconAlignLeft}
                  />
                )}

                {/* Full Description */}
                {product.description && (
                  <CollapsibleSection
                    title={t("productPage.sections.fullDescription")}
                    content={product.description}
                    defaultOpen={true}
                    icon={IconFileText}
                  />
                )}

                {/* Shipping Information */}
                <CollapsibleSection
                  title={t("productPage.sections.shippingInfo")}
                  content={`
                    <div class="space-y-6">
                      <div>
                        <h3 class="font-semibold text-neutral-900 mb-2">${t("productPage.shipping.deliveryTime.title")}</h3>
                        <p>${t("productPage.shipping.deliveryTime.intro")}</p>
                        <ul>
                          <li><strong>${t("productPage.shipping.deliveryTime.casablanca")}</strong> ${t("productPage.shipping.deliveryTime.casablancaTime")}</li>
                          <li><strong>${t("productPage.shipping.deliveryTime.majorCities")}</strong> ${t("productPage.shipping.deliveryTime.majorCitiesTime")}</li>
                          <li><strong>${t("productPage.shipping.deliveryTime.otherCities")}</strong> ${t("productPage.shipping.deliveryTime.otherCitiesTime")}</li>
                        </ul>
                        <p>${t("productPage.shipping.deliveryTime.shippingTime")}</p>
                      </div>
                      <div>
                        <h3 class="font-semibold text-neutral-900 mb-2">${t("productPage.shipping.shippingCost.title")}</h3>
                        <p>${t("productPage.shipping.shippingCost.intro")} <strong>${t("productPage.shipping.shippingCost.freeShipping")}</strong>.</p>
                        <p>${t("productPage.shipping.shippingCost.underMinTitle")}</p>
                        <ul>
                          <li>${t("productPage.shipping.shippingCost.localShipping")}</li>
                          <li>${t("productPage.shipping.shippingCost.outsideShipping")}</li>
                        </ul>
                      </div>
                      <div>
                        <h3 class="font-semibold text-neutral-900 mb-2">${t("productPage.shipping.trackingOrder.title")}</h3>
                        <p>${t("productPage.shipping.trackingOrder.intro")} <strong>${t("productPage.shipping.trackingOrder.trackingNumber")}</strong>.</p>
                        <p>${t("productPage.shipping.trackingOrder.usage")}</p>
                      </div>
                      <div>
                        <h3 class="font-semibold text-neutral-900 mb-2">${t("productPage.shipping.returnPolicy.title")}</h3>
                        <p>${t("productPage.shipping.returnPolicy.intro")} <strong>${t("productPage.shipping.returnPolicy.guarantee")}</strong> ${t("productPage.shipping.returnPolicy.fromReceipt")}</p>
                        <p>${t("productPage.shipping.returnPolicy.conditionsTitle")}</p>
                        <ul>
                          <li>${t("productPage.shipping.returnPolicy.condition1")}</li>
                          <li>${t("productPage.shipping.returnPolicy.condition2")}</li>
                          <li>${t("productPage.shipping.returnPolicy.condition3")}</li>
                        </ul>
                        <p>${t("productPage.shipping.returnPolicy.contact")}</p>
                      </div>
                    </div>
                  `}
                  defaultOpen={false}
                  icon={IconTruck}
                />
              </div>
            </div>
          </div>

          {/* Announcement Bar */}
          <AnnouncementBar />

          {/* CTA Card - Primary */}
          <CTACard variant="primary" />

          {/* Customer Reviews - Clean Modern Design */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-16 bg-neutral-50 py-12 rounded-3xl">
              {/* Header */}
              <div className="container mx-auto px-4 mb-10">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
                      <IconUsers size={28} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-neutral-900">
                        {t("productPage.reviews.title")}
                      </h2>
                      <p className="text-neutral-600">
                        {t("productPage.reviews.basedOn", { count: product.reviews.length })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-accent rounded-xl px-6 py-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <IconStarFilled key={i} size={20} className="text-white" />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews Container */}
              <div className="container mx-auto px-4">
                <div className="relative">
                  {/* Navigation Arrows */}
                  {totalPages > 1 && (
                    <>
                      <button
                        onClick={prevReview}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-primary p-3 text-white shadow-xl transition-all hover:scale-110 sm:-left-12"
                        aria-label="Previous reviews"
                      >
                        <IconChevronLeft size={24} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={nextReview}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-primary p-3 text-white shadow-xl transition-all hover:scale-110 sm:-right-12"
                        aria-label="Next reviews"
                      >
                        <IconChevronRight size={24} strokeWidth={2.5} />
                      </button>
                    </>
                  )}

                  {/* Review Cards Slider */}
                  <div className="overflow-x-hidden py-4 -mx-2 px-2">
                    <div
                      className="flex transition-transform duration-700 ease-in-out"
                      style={{ transform: `translateX(-${activeReviewIndex * 100}%)` }}
                    >
                      {Array.from({ length: totalPages }).map((_, pageIndex) => {
                        const pageReviews = product.reviews?.slice(
                          pageIndex * reviewsPerPage,
                          (pageIndex + 1) * reviewsPerPage
                        ) || [];
                        return (
                          <div key={pageIndex} className="w-full flex-shrink-0 px-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {pageReviews.map((review, reviewIndex) => {
                                const colors = [
                                  { border: "border-t-primary", icon: "bg-primary" },
                                  { border: "border-t-secondary", icon: "bg-secondary" },
                                  { border: "border-t-accent", icon: "bg-accent" }
                                ];
                                const color = colors[reviewIndex % 3];

                                return (
                                  <div
                                    key={reviewIndex}
                                    className={`bg-white rounded-xl border-t-4 ${color.border} shadow-md hover:shadow-xl transition-shadow duration-300`}
                                    style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}
                                  >
                                    {/* Card Header */}
                                    <div className="p-6">
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className={`h-12 w-12 rounded-lg ${color.icon} flex items-center justify-center flex-shrink-0`}>
                                          <span className="text-xl font-bold text-white">
                                            {review.reviewerName.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-neutral-900">
                                              {review.reviewerName}
                                            </h3>
                                            {review.verified && (
                                              <div className="bg-success rounded-md px-2 py-0.5 flex items-center">
                                                <IconCheck size={12} className="text-white" strokeWidth={3} />
                                              </div>
                                            )}
                                          </div>
                                          {review.date && (
                                            <p className="text-xs text-neutral-500">{review.date}</p>
                                          )}
                                        </div>
                                      </div>

                                      {/* Stars */}
                                      <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                          <IconStarFilled
                                            key={i}
                                            size={18}
                                            className={i < Math.floor(review.rating) ? "text-accent" : "text-neutral-300"}
                                          />
                                        ))}
                                      </div>

                                      {/* Review Text */}
                                      <p className="text-sm text-neutral-700 leading-relaxed">
                                        "{review.reviewText}"
                                      </p>
                                    </div>

                                    {/* Screenshots Section */}
                                    {review.images && review.images.length > 0 && (
                                      <div className="mt-auto border-t border-neutral-100 p-4 bg-neutral-50">
                                        <div className="grid grid-cols-2 gap-3">
                                          {review.images.map((image, imgIndex) => (
                                            <div
                                              key={imgIndex}
                                              className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-neutral-200 hover:border-primary transition-all"
                                              style={{ height: '140px' }}
                                              onClick={() => openImagePreview(review.images || [], imgIndex)}
                                            >
                                              <img
                                                src={image}
                                                alt={`Review screenshot ${imgIndex + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                              />
                                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                  <IconEye size={20} className="text-primary" strokeWidth={2.5} />
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Progress Dots */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveReviewIndex(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === activeReviewIndex
                              ? "w-8 bg-primary"
                              : "w-2 bg-neutral-300 hover:bg-neutral-400"
                          }`}
                          aria-label={`Go to page ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Announcement Bar */}
          <AnnouncementBar />

          {/* CTA Card - Secondary */}
          <CTACard variant="secondary" />

          {/* Announcement Bar */}
          <AnnouncementBar />

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 bg-neutral-50 py-12 rounded-3xl">
              {/* Header */}
              <div className="container mx-auto px-4 mb-10">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
                      <IconShoppingCart size={28} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-neutral-900">
                        {t("common.viewAll")}
                      </h2>
                      <p className="text-neutral-600">
                        {t("productPage.relatedProducts.subtitle")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Container */}
              <div className="container mx-auto px-4">
                <div className="relative">
                  {/* Navigation Arrows */}
                  {totalRelatedSlides > 1 && (
                    <>
                      <button
                        onClick={prevRelatedProducts}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-primary p-3 text-white shadow-xl transition-all hover:scale-110 sm:-left-12"
                        aria-label="Previous products"
                      >
                        <IconChevronLeft size={24} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={nextRelatedProducts}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-primary p-3 text-white shadow-xl transition-all hover:scale-110 sm:-right-12"
                        aria-label="Next products"
                      >
                        <IconChevronRight size={24} strokeWidth={2.5} />
                      </button>
                    </>
                  )}

                {/* Product Cards - 2 Columns */}
                <div className="overflow-x-hidden py-6 -mx-4 px-4">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${activeRelatedProductSlide * 100}%)` }}
                  >
                    {Array.from({ length: totalRelatedSlides }).map((_, slideIndex) => (
                      <div
                        key={slideIndex}
                        className="grid w-full flex-shrink-0 grid-cols-1 gap-6 md:grid-cols-2"
                      >
                        {relatedProducts
                          .slice(slideIndex * productsPerSlide, (slideIndex + 1) * productsPerSlide)
                          .map((relatedProduct) => {
                            const discount = relatedProduct.originalPrice
                              ? Math.round(((relatedProduct.originalPrice - relatedProduct.price) / relatedProduct.originalPrice) * 100)
                              : 0;

                            return (
                              <Link
                                key={relatedProduct._id}
                                href={`/product/${relatedProduct.slug}`}
                                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-neutral-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:ring-primary"
                              >
                                {/* Product Image */}
                                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                                  <Image
                                    src={relatedProduct.image}
                                    alt={relatedProduct.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                  />
                                  {/* Badge */}
                                  {relatedProduct.badge && (
                                    <span
                                      className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg ${
                                        relatedProduct.badge === "sale"
                                          ? "bg-primary"
                                          : relatedProduct.badge === "new"
                                            ? "bg-secondary"
                                            : "bg-accent"
                                      }`}
                                    >
                                      {t(`badges.${relatedProduct.badge}`)}
                                    </span>
                                  )}
                                  {/* Discount Badge */}
                                  {discount > 0 && (
                                    <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                                      -{discount}%
                                    </span>
                                  )}
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-1 flex-col p-6">
                                  {/* Category */}
                                  <span className="mb-2 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                                    {t(`categories.${relatedProduct.categoryId}`)}
                                  </span>

                                  {/* Product Name */}
                                  <h3 className="mb-3 text-lg font-bold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors">
                                    {relatedProduct.name}
                                  </h3>

                                  {/* Rating */}
                                  <div className="mb-4 flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <IconStarFilled
                                          key={i}
                                          size={16}
                                          className={i < Math.floor(relatedProduct.rating) ? "text-accent" : "text-neutral-200"}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-neutral-600">
                                      ({relatedProduct.reviewCount})
                                    </span>
                                  </div>

                                  {/* Price */}
                                  <div className="mt-auto flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-primary">
                                      {formatPriceSimple(relatedProduct.price)}
                                    </span>
                                    {relatedProduct.originalPrice && (
                                      <span className="text-sm text-neutral-400 line-through">
                                        {formatPriceSimple(relatedProduct.originalPrice)}
                                      </span>
                                    )}
                                  </div>

                                  {/* View Button */}
                                  <button className="mt-4 w-full rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg">
                                    {t("common.shopNow")}
                                  </button>
                                </div>
                              </Link>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                </div>

                  {/* Progress Dots */}
                  {totalRelatedSlides > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      {Array.from({ length: totalRelatedSlides }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveRelatedProductSlide(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === activeRelatedProductSlide
                              ? "w-8 bg-primary"
                              : "w-2 bg-neutral-300 hover:bg-neutral-400"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Announcement Bar */}
          <AnnouncementBar />

          {/* CTA Card - Accent */}
          <CTACard variant="accent" />
        </div>
      </section>
    </div>
    </>
  );
}
