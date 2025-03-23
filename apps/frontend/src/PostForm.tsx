import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import authService from "./services/auth-service";
import { useNavigate } from "react-router-dom";
import { Post } from "@things-i-like/post";
import { uploadPhoto } from "./services/file-service";

const schema = z.object({
  title: z.string().nonempty("Title is required"),
  content: z.string(),
  photo: z.string().optional(),
});

export type PostFormData = z.infer<typeof schema>;

interface PostFormProps {
  onSubmit: (data: PostFormData) => Promise<void>;
  initialData?: Post;
  action: string;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, initialData, action }) => {
  const { register, handleSubmit, formState } = useForm<PostFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialData,
  });
  const [imgSrc, setImgSrc] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  const onSubmitExtended = (data: PostFormData) => {
    if (!imgSrc) {
      onSubmit(data);
      return;
    } else {
      uploadPhoto(imgSrc as File).then((url) => {
        onSubmit({
          ...data,
          photo: url,
        });
      });
    }
  };

  return (
    <div className="container mt-5" style={{ paddingBottom: "40px" }}>
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm" style={{ width: "80%", margin: "0 auto" }}>
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{action}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmitExtended)}>
                <div className="mb-3">
                  <label htmlFor="file" className="form-label fw-bold">
                    Photo
                  </label>
                  <div className="d-flex justify-content-center position-relative mb-3">
                    {(imgSrc || initialData?.photo) && (
                      <img
                        src={imgSrc ? URL.createObjectURL(imgSrc) : initialData?.photo}
                        alt="Selected"
                        className="img-fluid rounded"
                        style={{ height: "230px", width: "230px", objectFit: "cover" }}
                      />
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary position-absolute bottom-0 end-0"
                      onClick={selectImg}
                    >
                      Select
                    </button>
                  </div>
                  <input
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    type="file"
                    onChange={imgSelected}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-bold">
                    Title
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    id="title"
                    className={`form-control ${formState.errors.title ? "is-invalid" : ""}`}
                  />
                  {formState.errors.title && (
                    <div className="invalid-feedback">{formState.errors.title?.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label fw-bold">
                    Content
                  </label>
                  <textarea
                    {...register("content")}
                    id="content"
                    rows={5}
                    className={`form-control ${formState.errors.content ? "is-invalid" : ""}`}
                  />
                  {formState.errors.content && (
                    <div className="invalid-feedback">{formState.errors.content?.message}</div>
                  )}
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    {action}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;