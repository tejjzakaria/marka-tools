/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  IconSettings,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandTiktok,
  IconCode,
  IconToggleLeft,
  IconToggleRight,
  IconDeviceAnalytics,
  IconLoader2,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import AdminNav from "@/components/admin/AdminNav";
import { useAdminFetch } from "@/hooks/useAdminFetch";

interface Setting {
  _id: string;
  key: string;
  value: string;
  category: string;
  isActive: boolean;
}

const trackingPixels = [
  {
    key: "facebook_pixel_id",
    name: "Facebook Pixel",
    icon: IconBrandFacebook,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    placeholder: "123456789012345",
    description: "Facebook Pixel ID for tracking conversions and events",
  },
  {
    key: "google_analytics_id",
    name: "Google Analytics",
    icon: IconBrandGoogle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    placeholder: "G-XXXXXXXXXX or UA-XXXXXXXXX-X",
    description: "Google Analytics Measurement ID (GA4) or Universal Analytics ID",
  },
  {
    key: "google_tag_manager_id",
    name: "Google Tag Manager",
    icon: IconCode,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    placeholder: "GTM-XXXXXXX",
    description: "Google Tag Manager Container ID",
  },
  {
    key: "tiktok_pixel_id",
    name: "TikTok Pixel",
    icon: IconBrandTiktok,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    placeholder: "XXXXXXXXXXXXXXXXXXXX",
    description: "TikTok Pixel ID for tracking events and conversions",
  },
  {
    key: "snapchat_pixel_id",
    name: "Snapchat Pixel",
    icon: IconDeviceAnalytics,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    description: "Snapchat Pixel ID for tracking conversions",
  },
];

export default function SettingsContent() {
  const adminFetch = useAdminFetch();
  const t = useTranslations("admin.settings");
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{
    key: string;
    status: "success" | "error";
  } | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await adminFetch("/api/admin/settings?category=tracking");

      const data = await response.json();

      if (data.success) {
        const settingsMap = data.settings.reduce((acc: Record<string, Setting>, setting: Setting) => {
          acc[setting.key] = setting;
          return acc;
        }, {});
        setSettings(settingsMap);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSetting = async (key: string, value: string, isActive: boolean) => {
    setSaving(key);
    setSaveStatus(null);

    try {
      const response = await adminFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify({
          key,
          value,
          category: "tracking",
          isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus({ key, status: "success" });
        fetchSettings();
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus({ key, status: "error" });
      }
    } catch (error) {
      console.error("Error saving setting:", error);
      setSaveStatus({ key, status: "error" });
    } finally {
      setSaving(null);
    }
  };

  const toggleActive = async (key: string) => {
    const setting = settings[key];
    if (!setting) return;

    await saveSetting(key, setting.value, !setting.isActive);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <AdminNav />

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <IconSettings size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{t("title")}</h1>
              <p className="text-neutral-600">{t("subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mb-6 rounded-2xl bg-blue-50 p-6">
          <div className="flex items-start gap-3">
            <IconDeviceAnalytics size={24} className="mt-1 text-blue-600" />
            <div>
              <h3 className="mb-2 font-semibold text-blue-900">{t("infoTitle")}</h3>
              <p className="text-sm text-blue-700">{t("infoDescription")}</p>
            </div>
          </div>
        </div>

        {/* Tracking Pixels */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <IconLoader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {trackingPixels.map((pixel) => {
              const setting = settings[pixel.key];
              const Icon = pixel.icon;
              const isActive = setting?.isActive ?? false;
              const value = setting?.value ?? "";

              return (
                <div
                  key={pixel.key}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${pixel.bgColor}`}>
                          <Icon size={24} className={pixel.color} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {pixel.name}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            {pixel.description}
                          </p>
                        </div>
                      </div>

                      {/* Active Toggle */}
                      <button
                        onClick={() => toggleActive(pixel.key)}
                        disabled={saving === pixel.key || !value}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          isActive && value
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                        } disabled:opacity-50`}
                      >
                        {isActive && value ? (
                          <>
                            <IconToggleRight size={20} />
                            {t("active")}
                          </>
                        ) : (
                          <>
                            <IconToggleLeft size={20} />
                            {t("inactive")}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Input Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">
                        {pixel.name} ID
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => {
                            const newSettings = { ...settings };
                            if (newSettings[pixel.key]) {
                              newSettings[pixel.key].value = e.target.value;
                            } else {
                              newSettings[pixel.key] = {
                                _id: "",
                                key: pixel.key,
                                value: e.target.value,
                                category: "tracking",
                                isActive: false,
                              };
                            }
                            setSettings(newSettings);
                          }}
                          placeholder={pixel.placeholder}
                          className="h-12 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 font-mono text-sm text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          onClick={() => saveSetting(pixel.key, value, isActive)}
                          disabled={saving === pixel.key || !value}
                          className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saving === pixel.key ? (
                            <>
                              <IconLoader2 size={18} className="animate-spin" />
                              {t("saving")}
                            </>
                          ) : (
                            t("save")
                          )}
                        </button>
                      </div>

                      {/* Save Status */}
                      {saveStatus?.key === pixel.key && (
                        <div
                          className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                            saveStatus.status === "success"
                              ? "bg-success/10 text-success"
                              : "bg-error/10 text-error"
                          }`}
                        >
                          {saveStatus.status === "success" ? (
                            <>
                              <IconCheck size={18} />
                              {t("saveSuccess")}
                            </>
                          ) : (
                            <>
                              <IconAlertCircle size={18} />
                              {t("saveError")}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-neutral-900">{t("instructionsTitle")}</h3>
          <ol className="space-y-3 text-sm text-neutral-600">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                1
              </span>
              <span>{t("instruction1")}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                2
              </span>
              <span>{t("instruction2")}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                3
              </span>
              <span>{t("instruction3")}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                4
              </span>
              <span>{t("instruction4")}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
