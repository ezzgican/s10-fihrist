import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Form() {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({ mode: "all" });
  const queryClient = useQueryClient(); 

 

const mutation = useMutation({
  mutationFn: (newContact) => 
    axios.post("https://688247fb66a7eb81224e18ff.mockapi.io/fihrist/api/contact",
        newContact),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['contacts'] });
    history.push("/");
  }
});

const onSubmit = (data) => {
  if (isValid) {
   mutation.mutate(data);
  } 
  
}

  return (
    <form
      id="contact-form"
      className="contactForm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          type="text"
          {...register("first_name", { required: "Name is required" })}
        />
        <input
          placeholder="Last"
          type="text"
          {...register("last_name", { required: "Last Name is required" })}
        />
      </p>
      <label>
        <span>Email</span>
        <input
          type="text"
          placeholder="john.doe@example.com"
          {...register("email", { required: "Email Address is required" })}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          type="text"
          {...register("avatar", { required: "Avatar is required" })}
        />
      </label>
      {Object.keys(errors).length !== 0 && (
        <ul className="text-red-600 py-4 px-5 bg-red-200 rounded-xl">
          {errors.first_name && <li>{errors.first_name.message}</li>}
          {errors.last_name && <li>{errors.last_name.message}</li>}
          {errors.email && <li>{errors.email.message}</li>}
          {errors.avatar && <li>{errors.avatar.message}</li>}
        </ul>
      )}
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            history.goBack();
          }}
        >
          Cancel
        </button>
      </p>
    </form>
  );
}
