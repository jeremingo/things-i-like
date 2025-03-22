import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import authService from "./services/auth-service";
import { useNavigate } from "react-router-dom";
import { Post } from "@things-i-like/post";

const schema = z.object({
  title: z.string()
    .nonempty('Title is required'),
  content: z.string()
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

  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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