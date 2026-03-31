import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast, { Toaster } from "react-hot-toast";
import api from "../../axios";
import Navbar from "../../utility/Navbar";

interface CertificateData {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  instructorName: string;
}

function Certificate() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.user);

  const [certificateData, setCertificateData] =
    useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const { data } = await api.get(`/certificate/${courseId}`);
        setCertificateData(data.certificateData);
      } catch (error: any) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to load certificate",
        );
        navigate("/student-dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [courseId, navigate]);

  const downloadCertificate = async () => {
    setLoading(true);
    const certificateElement = document.getElementById("certificate");

    if (!certificateElement) return;

    try {
      const canvas = await html2canvas(certificateElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${certificateData?.courseTitle || "Course"}_Certificate.pdf`);

      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl">Loading certificate...</p>
      </div>
    );
  }

  if (!certificateData) {
    return <div className="text-center py-20">Certificate not available</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-200 py-10">
        <Toaster position="top-center" />

        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={() => navigate("/student-dashboard")}
            className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>

          <div
            id="certificate"
            className="bg-white border-[14px] border-[#1e40af] rounded-3xl shadow-2xl p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-12 right-12 text-[140px] opacity-10">
              🏆
            </div>

            <h1 className="text-6xl font-bold text-[#1e40af] tracking-widest mb-6">
              CERTIFICATE OF COMPLETION
            </h1>

            <p className="text-2xl text-gray-600 mb-8">
              This is to certify that
            </p>

            <h2 className="text-5xl font-bold text-gray-900 mb-10">
              {certificateData.studentName}
            </h2>

            <p className="text-2xl text-gray-600 mb-8">
              has successfully completed
            </p>

            <h3 className="text-4xl font-bold text-[#1e40af] mb-14 px-10">
              {certificateData.courseTitle}
            </h3>

            <div className="flex justify-between items-end mt-20">
              <div>
                <p className="font-medium text-gray-500">Issued on</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(certificateData.completionDate).toLocaleDateString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>

              <div className="text-center">
                <div className="w-48 h-px bg-gray-400 mx-auto mb-3"></div>
                <p className="font-medium">{certificateData.instructorName}</p>
                <p className="text-xs text-gray-500">Instructor</p>
              </div>

              <div>
                <p className="font-medium text-gray-500">Platform</p>
                <p className="font-bold text-[#1e40af]">Mini Udemy</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={downloadCertificate}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-16 py-5 rounded-2xl text-xl font-semibold transition disabled:opacity-70 flex items-center gap-3 mx-auto"
            >
              {loading ? "Generating PDF..." : "📄 Download Certificate as PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
