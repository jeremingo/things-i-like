import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import authService from "./services/auth-service";
import { useNavigate } from "react-router-dom";
import { Post } from "@things-i-like/post";
import { uploadPhoto } from "./services/file-service";

const schema = z.object({
  title: z.string()
    .nonempty('Title is required'),
  content: z.string(),
  photo: z.string().optional(),
})

export type PostFormData = z.infer<typeof schema>;

interface PostFormProps {
  onSubmit: (data: PostFormData) => Promise<void>;
  initialData?: Post;
  action: string;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, initialData, action }) => {
  const { register, handleSubmit, formState } = useForm<PostFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: initialData,
  });
  const [imgSrc, setImgSrc] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0])
    }
  }
  const selectImg = () => {
    console.log("Selecting image...")
    fileInputRef.current?.click()
  }

  const onSubmitExtended = (data: PostFormData) =>{
    if (!imgSrc) {
      onSubmit(data)
      return
    } else {
      uploadPhoto(imgSrc as File).then((url) => {
        onSubmit({
          ...data,
          photo: url
        });
      })
    }
  };

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit(onSubmitExtended)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label htmlFor="file" style={{ fontWeight: 'bold' }}>Photo</label>
        <div className="d-flex justify-content-center position-relative">
          {(imgSrc || initialData?.photo) && 
          <img src={imgSrc ? URL.createObjectURL(imgSrc) : initialData?.photo} style={{ height: "230px", width: "230px" }} className="img-fluid" />}
          <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
            Select
          </button>
        </div>

        <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input>

        <label htmlFor="title" style={{ fontWeight: 'bold' }}>Title</label>
        <input {...register('title')} type="text" id="title" />
        {formState.errors.title && <p>{formState.errors.title?.message}</p>}

        <label htmlFor="content" style={{ fontWeight: 'bold' }}>Content</label>
        <textarea {...register('content')} id="content" rows={5} />
        {formState.errors.content && <p>{formState.errors.content?.message}</p>}

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {action}
        </button>
      </form>
    </div>
  );
};

export default PostForm;