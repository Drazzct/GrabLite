import { Phone } from "lucide-react";

const EmergencySection = () => {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-yellow-700 mb-2">
            Cần trợ giúp?
          </h3>
          <p className="text-yellow-600">
            Nếu bạn gặp sự cố trong chuyến đi hoặc lỗi khi đang dùng dịch vụ,
            liên hệ với chúng tôi ngay
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold whitespace-nowrap">
          <Phone className="w-5 h-5" />
          1900 1234
        </button>
      </div>
    </div>
  );
};

export default EmergencySection;
