/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Select from 'react-select';
import {
  IconUpload,
  IconX,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconCheck,
  IconAlertCircle,
  IconPackage,
  IconTag,
  IconCurrencyDirham,
  IconFileDescription,
  IconCategory,
  IconStarFilled,
  IconBoxSeam,
  IconShieldCheck,
  IconStar,
  IconMessageCircle,
  IconShoppingCart,
  IconEye,
  IconLoader2,
  IconEdit,
  IconGift,
  IconFileSpreadsheet,
} from '@tabler/icons-react';
import { categories } from '@/data/categories';
import IconSelector from '@/components/admin/IconSelector';
import AdminNav from '@/components/admin/AdminNav';
import { useAdminFetch } from '@/hooks/useAdminFetch';
import { RichTextEditor } from '@/components/admin/RichTextEditor/RichTextEditor';

interface EditProductFormProps {
  productId: string;
}

interface ProductFeature {
  icon: string;
  title: string;
  description: string;
}

interface ProductOffer {
  icon: string;
  text: string;
  price: string;
}

interface ProductReview {
  reviewerName: string;
  reviewText: string;
  rating: number;
  date: string;
  verified: boolean;
  images: UploadedImage[];
}

interface UploadedImage {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
}

export default function EditProductForm({ productId }: EditProductFormProps) {
  const t = useTranslations('admin.addProduct');
  const tCategories = useTranslations('categories');
  const adminFetch = useAdminFetch();
  const [loading, setLoading] = useState(true);

  const badgeOptions = [
    { value: '', label: t('noBadge') },
    { value: 'new', label: t('badgeNew') },
    { value: 'sale', label: t('badgeSale') },
    { value: 'bestseller', label: t('badgeBestseller') },
  ];

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: tCategories(cat.id),
  }));

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    badge: '',
    stockCount: '',
    sku: '',
    guaranteeDays: '30',
    rating: '4.5',
    reviewCount: '0',
    soldCount: '0',
    viewersCount: '0',
    googleSheetId: '',
  });

  const [highlights, setHighlights] = useState<string[]>(['']);
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [offers, setOffers] = useState<ProductOffer[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await adminFetch(`/api/admin/products/${productId}`);

        const data = await response.json();

        if (data.success) {
          const product = data.product;

          // Populate form data
          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            shortDescription: product.shortDescription || '',
            price: product.price?.toString() || '',
            originalPrice: product.originalPrice?.toString() || '',
            categoryId: product.categoryId || '',
            badge: product.badge || '',
            stockCount: product.stockCount?.toString() || '0',
            sku: product.sku || '',
            guaranteeDays: product.guaranteeDays?.toString() || '30',
            rating: product.rating?.toString() || '4.5',
            reviewCount: product.reviewCount?.toString() || '0',
            soldCount: product.soldCount?.toString() || '0',
            viewersCount: product.viewersCount?.toString() || '0',
            googleSheetId: product.googleSheetId || '',
          });

          // Populate highlights
          if (product.highlights && product.highlights.length > 0) {
            setHighlights(product.highlights);
          }

          // Populate features
          if (product.features && product.features.length > 0) {
            setFeatures(product.features);
          }

          // Populate offers
          if (product.offers && product.offers.length > 0) {
            const existingOffers: ProductOffer[] = product.offers.map((offer: any) => ({
              icon: offer.icon || '',
              text: offer.text || '',
              price: offer.price?.toString() || '',
            }));
            setOffers(existingOffers);
          }

          // Populate images
          if (product.images && product.images.length > 0) {
            const existingImages: UploadedImage[] = product.images.map((url: string) => ({
              file: null as unknown as File,
              preview: url,
              uploading: false,
              uploaded: true,
              url: url,
            }));
            setImages(existingImages);

            // Set main image index
            const mainImageUrl = product.image;
            const mainIndex = product.images.indexOf(mainImageUrl);
            if (mainIndex !== -1) {
              setMainImageIndex(mainIndex);
            }
          }

          // Populate reviews
          if (product.reviews && product.reviews.length > 0) {
            const existingReviews: ProductReview[] = product.reviews.map((review: any) => ({
              reviewerName: review.reviewerName || '',
              reviewText: review.reviewText || '',
              rating: review.rating || 5,
              date: review.date || '',
              verified: review.verified !== undefined ? review.verified : true,
              images: (review.images || []).map((url: string) => ({
                file: null as unknown as File,
                preview: url,
                uploading: false,
                uploaded: true,
                url: url,
              })),
            }));
            setReviews(existingReviews);
          }
        } else {
          setSubmitStatus({
            type: 'error',
            message: 'Failed to load product',
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setSubmitStatus({
          type: 'error',
          message: 'Error loading product',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, adminFetch]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'name') {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const handleSelectChange = (
    name: string,
    option: { value: string; label: string } | null
  ) => {
    setFormData((prev) => ({ ...prev, [name]: option?.value || '' }));
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const addHighlight = () => {
    setHighlights([...highlights, '']);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFeatures([...features, { icon: '', title: '', description: '' }]);
  };

  const updateFeature = (
    index: number,
    field: keyof ProductFeature,
    value: string
  ) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addOffer = () => {
    setOffers([...offers, { icon: '', text: '', price: '' }]);
  };

  const updateOffer = (
    index: number,
    field: keyof ProductOffer,
    value: string
  ) => {
    const newOffers = [...offers];
    newOffers[index][field] = value;
    setOffers(newOffers);
  };

  const removeOffer = (index: number) => {
    setOffers(offers.filter((_, i) => i !== index));
  };

  const addReview = () => {
    setReviews([
      ...reviews,
      {
        reviewerName: '',
        reviewText: '',
        rating: 5,
        date: '',
        verified: true,
        images: [],
      },
    ]);
  };

  const updateReview = (
    index: number,
    field: keyof Omit<ProductReview, 'images'>,
    value: string | number | boolean
  ) => {
    const newReviews = [...reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setReviews(newReviews);
  };

  const removeReview = (index: number) => {
    setReviews(reviews.filter((_, i) => i !== index));
  };

  const handleReviewImageSelect = useCallback(
    (reviewIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newImages: UploadedImage[] = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploading: false,
        uploaded: false,
      }));
      const newReviews = [...reviews];
      newReviews[reviewIndex].images = [...newReviews[reviewIndex].images, ...newImages];
      setReviews(newReviews);
    },
    [reviews]
  );

  const removeReviewImage = (reviewIndex: number, imageIndex: number) => {
    const newReviews = [...reviews];
    newReviews[reviewIndex].images = newReviews[reviewIndex].images.filter(
      (_, i) => i !== imageIndex
    );
    setReviews(newReviews);
  };

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newImages: UploadedImage[] = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploading: false,
        uploaded: false,
      }));
      setImages((prev) => [...prev, ...newImages]);
    },
    []
  );

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      if (mainImageIndex >= newImages.length) {
        setMainImageIndex(Math.max(0, newImages.length - 1));
      } else if (index < mainImageIndex) {
        setMainImageIndex(mainImageIndex - 1);
      }
      return newImages;
    });
  };

  const uploadImage = async (image: UploadedImage, index: number): Promise<string | null> => {
    setImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, uploading: true, error: undefined } : img
      )
    );

    try {
      const formData = new FormData();
      formData.append('file', image.file);

      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to upload image');
      }

      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? { ...img, uploading: false, uploaded: true, url: data.fileUrl }
            : img
        )
      );

      return data.fileUrl;
    } catch (error) {
      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? {
                ...img,
                uploading: false,
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : img
        )
      );
      return null;
    }
  };

  const uploadAllImages = async (): Promise<string[]> => {
    const uploadPromises = images.map(async (img, index) => {
      if (img.uploaded && img.url) {
        return img.url;
      }
      if (!img.uploading) {
        return await uploadImage(img, index);
      }
      return null;
    });

    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  };

  const uploadReviewImage = async (image: UploadedImage): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', image.file);

      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to upload image');
      }

      return data.fileUrl;
    } catch (error) {
      console.error('Review image upload failed:', error);
      return null;
    }
  };

  const uploadAllReviewImages = async (): Promise<Array<Omit<ProductReview, 'images'> & { images: string[] }>> => {
    const reviewsWithUploadedImages = await Promise.all(
      reviews.map(async (review) => {
        const uploadedImageUrls = await Promise.all(
          review.images.map(async (img) => {
            if (img.uploaded && img.url) {
              return img.url;
            }
            return await uploadReviewImage(img);
          })
        );

        return {
          reviewerName: review.reviewerName,
          reviewText: review.reviewText,
          rating: review.rating,
          date: review.date,
          verified: review.verified,
          images: uploadedImageUrls.filter((url): url is string => url !== null),
        };
      })
    );

    return reviewsWithUploadedImages;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    if (images.length === 0) {
      setSubmitStatus({
        type: 'error',
        message: t('uploadError'),
      });
      setIsSubmitting(false);
      return;
    }

    // Upload all images and get URLs
    const uploadedUrls = await uploadAllImages();

    // Check if we have any successfully uploaded images
    const currentImages = uploadedUrls;

    if (currentImages.length === 0) {
      setSubmitStatus({
        type: 'error',
        message: t('uploadError'),
      });
      setIsSubmitting(false);
      return;
    }

    const mainImage = currentImages[mainImageIndex] || currentImages[0];
    const allImageUrls = currentImages;

    // Upload review images
    const reviewsWithUploadedImages = await uploadAllReviewImages();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : undefined,
      stockCount: parseInt(formData.stockCount) || 0,
      guaranteeDays: parseInt(formData.guaranteeDays) || 30,
      rating: parseFloat(formData.rating) || 4.5,
      reviewCount: parseInt(formData.reviewCount) || 0,
      soldCount: parseInt(formData.soldCount) || 0,
      viewersCount: parseInt(formData.viewersCount) || 0,
      image: mainImage,
      images: allImageUrls,
      highlights: highlights.filter((h) => h.trim() !== ''),
      features: features.filter(
        (f) => f.title.trim() !== '' && f.description.trim() !== ''
      ),
      offers: offers
        .filter((o) => o.text.trim() !== '' && o.price.trim() !== '')
        .map((o) => ({
          icon: o.icon,
          text: o.text,
          price: parseFloat(o.price),
        })),
      reviews: reviewsWithUploadedImages.filter(
        (r) => r.reviewerName.trim() !== '' && r.reviewText.trim() !== ''
      ),
      googleSheetId: formData.googleSheetId.trim() || undefined,
    };

    try {
      const response = await adminFetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: `Product "${data.product.name}" updated successfully!`,
        });
        // Don't reset form on edit, keep the data
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || t('error'),
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: t('error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <AdminNav />
          <div className="flex h-64 items-center justify-center">
            <IconLoader2 size={40} className="animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <AdminNav />

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <IconEdit size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Edit Product</h1>
              <p className="text-neutral-600">Update product details below</p>
            </div>
          </div>

          {submitStatus.type && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                submitStatus.type === 'success'
                  ? 'bg-success/10 text-success'
                  : 'bg-error/10 text-error'
              }`}
            >
              {submitStatus.type === 'success' ? (
                <IconCheck size={20} />
              ) : (
                <IconAlertCircle size={20} />
              )}
              <span>{submitStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <IconTag size={20} className="text-primary" />
                {t('basicInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('productName')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={t('productNamePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('slug')} *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={t('slugPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('sku')}
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={t('skuPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <span className="flex items-center gap-1">
                      <IconCategory size={16} />
                      {t('category')} *
                    </span>
                  </label>
                  <Select
                    options={categoryOptions}
                    value={categoryOptions.find((opt) => opt.value === formData.categoryId)}
                    onChange={(opt) => handleSelectChange('categoryId', opt)}
                    placeholder={t('selectCategory')}
                    isSearchable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </section>

            {/* Descriptions */}
            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <IconFileDescription size={20} className="text-primary" />
                {t('descriptions')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('shortDescription')} *
                  </label>
                  <RichTextEditor
                    value={formData.shortDescription}
                    onChange={(html) => setFormData(prev => ({ ...prev, shortDescription: html }))}
                    placeholder={t('shortDescriptionPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('fullDescription')} *
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                    placeholder={t('fullDescriptionPlaceholder')}
                  />
                </div>
              </div>
            </section>

            {/* Pricing & Stock */}
            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <IconCurrencyDirham size={20} className="text-primary" />
                {t('pricingStock')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('price')} *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={t('pricePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('originalPrice')}
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={t('originalPricePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <span className="flex items-center gap-1">
                      <IconBoxSeam size={16} />
                      {t('stockCount')} *
                    </span>
                  </label>
                  <input
                    type="number"
                    name="stockCount"
                    value={formData.stockCount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={t('stockCountPlaceholder')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <span className="flex items-center gap-1">
                      <IconStarFilled size={16} />
                      {t('badge')}
                    </span>
                  </label>
                  <Select
                    options={badgeOptions}
                    value={badgeOptions.find((opt) => opt.value === formData.badge)}
                    onChange={(opt) => handleSelectChange('badge', opt)}
                    placeholder={t('selectBadge')}
                    isSearchable
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <span className="flex items-center gap-1">
                      <IconShieldCheck size={16} />
                      {t('guaranteeDays')}
                    </span>
                  </label>
                  <input
                    type="number"
                    name="guaranteeDays"
                    value={formData.guaranteeDays}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="30"
                  />
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <span className="flex items-center gap-1">
                      <IconStar size={16} />
                      {t('rating')}
                    </span>
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="4.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <span className="flex items-center gap-1">
                      <IconMessageCircle size={16} />
                      {t('reviewCount')}
                    </span>
                  </label>
                  <input
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <span className="flex items-center gap-1">
                      <IconShoppingCart size={16} />
                      {t('soldCount')}
                    </span>
                  </label>
                  <input
                    type="number"
                    name="soldCount"
                    value={formData.soldCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    <span className="flex items-center gap-1">
                      <IconEye size={16} />
                      {t('viewersCount')}
                    </span>
                  </label>
                  <input
                    type="number"
                    name="viewersCount"
                    value={formData.viewersCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>
            </section>

            {/* Google Sheets Integration */}
            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <IconFileSpreadsheet size={20} className="text-primary" />
                {t('googleSheetsIntegration')}
              </h2>
              <div className="mb-4 p-4 bg-info/10 border border-info/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <IconAlertCircle size={20} className="text-info mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700 mb-2">
                      {t('googleSheetDisclaimer')}
                    </p>
                    <code className="block px-3 py-2 bg-white border border-neutral-200 rounded text-sm font-mono text-neutral-900 select-all">
                      amanaexpress@amanaexpress.iam.gserviceaccount.com
                    </code>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {t('googleSheetId')}
                </label>
                <input
                  type="text"
                  name="googleSheetId"
                  value={formData.googleSheetId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                  placeholder={t('googleSheetIdPlaceholder')}
                />
                <p className="mt-1 text-xs text-neutral-500">
                  {t('googleSheetIdHelp')}
                </p>
              </div>
            </section>

            {/* Images */}
            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <IconPhoto size={20} className="text-primary" />
                {t('images')}
              </h2>
              <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center">
                    <IconUpload size={24} className="text-neutral-500" />
                  </div>
                  <span className="text-neutral-700 font-medium">
                    {t('uploadImages')}
                  </span>
                  <span className="text-sm text-neutral-500">
                    {t('imageFormats')}
                  </span>
                </label>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative rounded-lg overflow-hidden border-2 ${
                        mainImageIndex === index
                          ? 'border-primary'
                          : 'border-neutral-200'
                      }`}
                    >
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMainImageIndex(index)}
                          className={`p-2 rounded-full ${
                            mainImageIndex === index
                              ? 'bg-primary text-white'
                              : 'bg-white text-neutral-700'
                          }`}
                          title={t('setAsMain')}
                        >
                          <IconStarFilled size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 rounded-full bg-white text-error"
                          title={t('removeImage')}
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                      {image.uploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {image.uploaded && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                          <IconCheck size={14} className="text-white" />
                        </div>
                      )}
                      {image.error && (
                        <div className="absolute bottom-0 left-0 right-0 bg-error text-white text-xs p-1 text-center">
                          {image.error}
                        </div>
                      )}
                      {mainImageIndex === index && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          {t('mainImage')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <IconStarFilled size={20} className="text-primary" />
                {t('highlights')}
              </h2>
              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleHighlightChange(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder={t('highlightPlaceholder', { number: index + 1 })}
                    />
                    {highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="p-2.5 text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <IconX size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHighlight}
                  className="inline-flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <IconPlus size={18} />
                  {t('addHighlight')}
                </button>
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <IconCheck size={20} className="text-primary" />
                {t('features')}
              </h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-neutral-700">
                        {t('feature')} {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-1.5 text-error hover:bg-error/10 rounded transition-colors"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <IconSelector
                          value={feature.icon}
                          onChange={(value) => updateFeature(index, 'icon', value)}
                          placeholder={t('featureIcon')}
                        />
                      </div>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder={t('featureTitle')}
                      />
                      <input
                        type="text"
                        value={feature.description}
                        onChange={(e) =>
                          updateFeature(index, 'description', e.target.value)
                        }
                        className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder={t('featureDescription')}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <IconPlus size={18} />
                  {t('addFeature')}
                </button>
              </div>
            </section>

            {/* Offers */}
            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <IconGift size={20} className="text-primary" />
                {t('offers')}
              </h2>
              <div className="space-y-4">
                {offers.map((offer, index) => (
                  <div
                    key={index}
                    className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-neutral-700">
                        {t('offer')} {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeOffer(index)}
                        className="p-1.5 text-error hover:bg-error/10 rounded transition-colors"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <IconSelector
                          value={offer.icon}
                          onChange={(value) => updateOffer(index, 'icon', value)}
                          placeholder={t('offerIcon')}
                        />
                      </div>
                      <input
                        type="text"
                        value={offer.text}
                        onChange={(e) => updateOffer(index, 'text', e.target.value)}
                        className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder={t('offerText')}
                      />
                      <input
                        type="number"
                        value={offer.price}
                        onChange={(e) => updateOffer(index, 'price', e.target.value)}
                        className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder={t('offerPrice')}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOffer}
                  className="inline-flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <IconPlus size={18} />
                  {t('addOffer')}
                </button>
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <IconMessageCircle size={20} className="text-primary" />
                {t('reviews')}
              </h2>
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-neutral-700">
                        {t('review')} {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeReview(index)}
                        className="p-1.5 text-error hover:bg-error/10 rounded transition-colors"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={review.reviewerName}
                          onChange={(e) =>
                            updateReview(index, 'reviewerName', e.target.value)
                          }
                          className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder={t('reviewerName')}
                        />
                        <input
                          type="text"
                          value={review.date}
                          onChange={(e) => updateReview(index, 'date', e.target.value)}
                          className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder={t('reviewDate')}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-neutral-600 mb-1">
                            {t('reviewRating')}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={review.rating}
                            onChange={(e) =>
                              updateReview(index, 'rating', parseFloat(e.target.value))
                            }
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={review.verified}
                              onChange={(e) =>
                                updateReview(index, 'verified', e.target.checked)
                              }
                              className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-neutral-700">
                              {t('verifiedBuyer')}
                            </span>
                          </label>
                        </div>
                      </div>
                      <textarea
                        value={review.reviewText}
                        onChange={(e) =>
                          updateReview(index, 'reviewText', e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                        placeholder={t('reviewText')}
                      />

                      {/* Review Images (Screenshots) */}
                      <div>
                        <label className="block text-sm text-neutral-600 mb-2">
                          {t('reviewScreenshots')}
                        </label>
                        <div className="space-y-2">
                          {review.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {review.images.map((img, imgIndex) => (
                                <div key={imgIndex} className="relative group">
                                  <img
                                    src={img.preview}
                                    alt={`Review screenshot ${imgIndex + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-neutral-200"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeReviewImage(index, imgIndex)}
                                    className="absolute top-1 right-1 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <IconX size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <label className="inline-flex items-center gap-2 px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors">
                            <IconPhoto size={18} />
                            <span className="text-sm">{t('addScreenshot')}</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleReviewImageSelect(index, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addReview}
                  className="inline-flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <IconPlus size={18} />
                  {t('addReview')}
                </button>
              </div>
            </section>

            {/* Submit */}
            <div className="pt-4 border-t border-neutral-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('creating')}
                  </>
                ) : (
                  <>
                    <IconCheck size={20} />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
