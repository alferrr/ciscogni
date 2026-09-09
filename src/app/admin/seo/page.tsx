"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useToast } from "@/context/ToastContext";
import { FaImage, FaGlobe } from "react-icons/fa6";
import "./seo.css";

const SITE_URL = "https://ciscogni.dcism.org";

type SeoSettings = {
  title: string;
  description: string;
  keywords: string;
  ogImageUrl: string | null;
};

const EMPTY: SeoSettings = {
  title: "",
  description: "",
  keywords: "",
  ogImageUrl: null,
};

const SeoAdminPage = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<SeoSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/admin/seo")
      .then(({ data }) => setForm(data))
      .catch(() => showToast("Failed to load SEO settings.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append("file", file);
    setUploading(true);
    try {
      const { data } = await axios.post("/api/admin/seo/upload", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, ogImageUrl: data.url }));
      showToast("Image uploaded.", "success");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      showToast(message || "Upload failed.", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.description) {
      showToast("Title and description are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const { data } = await axios.put("/api/admin/seo", form);
      setForm(data);
      showToast("SEO settings saved.", "success");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      showToast(message || "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  const ogImageSrc = form.ogImageUrl || "/opengraph-image";

  return (
    <div className="seo-admin">
      <h1 className="admin-page-title">SEO Settings</h1>

      <div className="seo-layout">
        <div className="admin-card seo-form-card">
          <div className="admin-form">
            <div className="form-field">
              <label>Page Title ({form.title.length}/70)</label>
              <input
                value={form.title}
                maxLength={70}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ciscogni — Programming Practice for USC Students"
              />
            </div>

            <div className="form-field">
              <label>Meta Description ({form.description.length}/300)</label>
              <textarea
                value={form.description}
                maxLength={300}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe Ciscogni for search results..."
              />
            </div>

            <div className="form-field">
              <label>Keywords (comma-separated)</label>
              <input
                value={form.keywords}
                onChange={(e) =>
                  setForm({ ...form, keywords: e.target.value })
                }
                placeholder="Ciscogni, USC, Programming 1, Programming 2"
              />
            </div>

            <div className="form-field">
              <label>Social Share Image (1200×630 recommended)</label>
              <div className="seo-image-upload">
                <img src={ogImageSrc} alt="OG preview" className="seo-image-thumb" />
                <div>
                  <button
                    type="button"
                    className="admin-btn secondary"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaImage /> {uploading ? "Uploading..." : "Upload image"}
                  </button>
                  {form.ogImageUrl && (
                    <button
                      type="button"
                      className="admin-btn danger"
                      style={{ marginLeft: 8 }}
                      onClick={() => setForm({ ...form, ogImageUrl: null })}
                    >
                      Reset to default
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    hidden
                    onChange={handleUpload}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="admin-btn primary"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>

        <div className="seo-preview-col">
          <div className="admin-card">
            <h3 className="seo-preview-heading">
              <FaGlobe /> Google search preview
            </h3>
            <div className="serp-preview">
              <div className="serp-url">
                <div className="serp-favicon" />
                <div>
                  <div className="serp-site-name">Ciscogni</div>
                  <div className="serp-site-url">{SITE_URL}</div>
                </div>
              </div>
              <div className="serp-title">
                {form.title || "Page title goes here"}
              </div>
              <div className="serp-description">
                {(form.description || "Meta description goes here.").slice(
                  0,
                  160,
                )}
                {form.description.length > 160 ? "…" : ""}
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="seo-preview-heading">
              <FaImage /> Social share preview
            </h3>
            <div className="social-preview">
              <img src={ogImageSrc} alt="Social preview" />
              <div className="social-preview-body">
                <div className="social-preview-domain">
                  ciscogni.dcism.org
                </div>
                <div className="social-preview-title">
                  {form.title || "Page title goes here"}
                </div>
                <div className="social-preview-description">
                  {form.description || "Meta description goes here."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoAdminPage;
