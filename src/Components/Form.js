import { useForm } from "react-hook-form";
import classes from "./Form.module.css";

const Form = (props) => {
  const { register, resetField, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    if (data.comment.replaceAll(" ", "") === "") return;
    props.setData(data.comment);
    resetField("comment");
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.question}>
        <label style={{ fontSize: "0.9rem", color: "rgba(0, 0, 0, 0.7)" }}>
          What would you like to know about:
          <br />
          <span className={classes.questionText}>{props.question}</span>
        </label>
      </div>
      <label className={classes.commentLabel}>
        <textarea
          type="text"
          deafultvalue=""
          name="comment"
          {...register("comment")}
        />
        <span className={classes.placeholder}>Enter comment here...</span>
      </label>
      <input type="submit" className={classes.submit} />
    </form>
  );
};

export default Form;
