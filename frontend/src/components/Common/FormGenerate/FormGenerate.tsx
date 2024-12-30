import FileUpload from "@/components/Common/FileUpload/FileUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ApiError,
  type Body_items_create_item,
  type ItemPublic,
  ItemsService,
} from "@/client";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  FormControl,
  FormErrorMessage,
  Input,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { convertToFormData, handleError } from "@/utils";
import useCustomToast from "@/hooks/useCustomToast";

type Form_Body_items_create_item = Omit<Body_items_create_item, "file"> & {
  file: FileList;
};

const FormGenerate = () => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form_Body_items_create_item>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { mutate, data, isSuccess } = useMutation({
    mutationFn: (formData: any) => {
      return ItemsService.createItem({ formData: formData });
    },
    onSuccess: (data: ItemPublic) => {
      showToast("Success!", "Item created successfully.", "success");
      reset();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const onSubmit: SubmitHandler<Form_Body_items_create_item> = (data) => {
    const newData = {
      ...data,
      file: data.file[0],
    };
    const formData = convertToFormData(newData);
    mutate(formData);
  };

  return (
    <div className="relative isolate w-full bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto w-full px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h2 className="text-4xl font-semibold tracking-tight text-white">
                Input your prompt...
              </h2>
              <p className="mt-4 text-lg text-gray-300"></p>
              <div className="mt-6 flex flex-col max-w-md gap-x-4">
                <FormControl isRequired isInvalid={!!errors.title}>
                  <label
                    htmlFor="title"
                    className="text-white text-sm/6 font-medium"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    {...register("title", {
                      required: "Title is required.",
                    })}
                    placeholder="Title"
                    type="text"
                    className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  />
                  {errors.title && (
                    <FormErrorMessage>{errors.title.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl mt={4}>
                  <label
                    htmlFor="description"
                    className="text-white text-sm/6 font-medium"
                  >
                    Prompt
                  </label>
                  <Textarea
                    id="description"
                    {...register("description", {
                      required: "Prompt is required.",
                    })}
                    placeholder="Prompt"
                    className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  />
                  {errors.description && (
                    <FormErrorMessage>
                      {errors.description.message}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl mt={4}>
                  <label
                    htmlFor="is_public"
                    className="text-white text-sm/6 font-medium"
                  >
                    Public
                  </label>
                  <Switch {...register("is_public")} className="ml-4" />
                </FormControl>

                <div className="py-6">
                  <FileUpload
                    label="Upload image"
                    multiple={false}
                    className="text-white"
                    register={register("file")}
                  />
                </div>

                <button
                  type="submit"
                  className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
          <dl className="grid grid-cols-1 lg:pt-2">
            <div className="flex flex-col items-start px-6">
              {isSuccess && data && (
                <img
                  src={data.full_result_url}
                  className="w-full sm:w-[32rem] h-auto m-auto"
                />
              )}
            </div>
          </dl>
        </div>
      </div>
      <div
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default FormGenerate;
