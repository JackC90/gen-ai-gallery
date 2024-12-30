import React, { ReactNode, useState, useRef } from "react";
import { UseFormRegisterReturn, ChangeHandler } from "react-hook-form";

type FileUploadProps = {
  register: UseFormRegisterReturn;
  accept?: string;
  multiple?: boolean;
  children?: ReactNode;
  label?: string;
  className?: string;
};

const FileUpload = (props: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);

  const { register, accept, multiple, className, label } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, onChange, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void;
    onChange: ChangeHandler;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    onChange(event);
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm/6 font-medium text-white">{label}</label>
      <div className="w-full mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <svg
            className="mx-auto size-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
              clipRule="evenodd"
            />
          </svg>
          <div className="mt-4 flex text-sm/6 text-gray-600">
            <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
              {file ? (
                <span>Attached {file.name}</span>
              ) : (
                <span>Upload a file</span>
              )}
              <input
                type={"file"}
                multiple={multiple || false}
                hidden
                accept={accept}
                {...rest}
                onChange={handleFileChange}
                ref={(e) => {
                  ref(e);
                  inputRef.current = e;
                }}
              ></input>
            </label>
            {!file && <p className="pl-1">or drag and drop</p>}
          </div>
          <p className="text-xs/5 text-gray-200">Image up to 50MB</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
