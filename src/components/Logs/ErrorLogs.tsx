import { Space } from "antd";
import { ErrorLog } from "utils/importExcel";
import { interfaceToEnum } from "utils/type";

export type ErrorLogsProps = {
  errors: ErrorLog[];
  className?: string;
  count?: ImportResponse;
};

export type ImportResponse<T = {}> = {
  fileName: string;
  errorMessage: string[];
  success: number;
  total: number;
  fail: number;
} & T;

export const ImportResponseKeys = interfaceToEnum<ImportResponse>();

const ErrorLogs = ({ count, errors, className }: ErrorLogsProps) => {
  const dangerErrors = errors.filter((err) => err.type == "danger");
  const warningErrors = errors.filter((err) => err.type == "warning");

  return !!dangerErrors.length || !!warningErrors.length ? (
    <div>
      <div className="italic text-yellow-600 mb-1">
        * Số dòng tương ứng theo file Excel
      </div>
      <div
        className={[
          "p-2 text-white  errors bg-slate-700 max-h-[300px] overflow-y-auto",
          className,
        ].join(" ")}
      >
        {(count?.success || count?.total) && (
          <div className="mb-2">
            <Space split="-">
              <div className="text-green-500 font-semibold">
                {count.success} dữ liệu thành công
              </div>
              <div className="text-red-500 font-semibold">
                {count.total - count.success} dữ liệu không thành công
              </div>
            </Space>
          </div>
        )}
        {dangerErrors.map(({ message }) => (
          <>
            <div>
              <span className="text-red-500 font-semibold">LỖI</span> -{" "}
              {message}
            </div>
          </>
        ))}
        {warningErrors.map((item) => {
          const isDanger = typeof item == "string" ? false : item.message;
          const message = typeof item == "string" ? item : item.message;
          return (
            <div className={`${isDanger ? "text-red-500 " : ""}`}>
              <span className={`text-yellow-500 font-semibold`}>CẢNH BÁO</span>{" "}
              - {message}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ErrorLogs;
