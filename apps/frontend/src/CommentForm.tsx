import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import authService from "./services/auth-service";
import { useNavigate } from "react-router-dom";
import { Comment } from "@things-i-like/comment";

const schema = z.object({
  content: z.string()
    .nonempty('Title is required'),
})

export type CommentFormData = z.infer<typeof schema>;

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>;
  initialData?: Comment;
  action: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, initialData, action }) => {
  const { register, handleSubmit, formState } = useForm<CommentFormData>({
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

export default CommentForm;