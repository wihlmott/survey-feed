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
        <label>
          What would you like to know about:
          <br />
          {props.question}
        </label>
      </div>
      <label className={classes.commentLabel}>
        <textarea
          type="text"
          deafultvalue=""
          name="comment"
          {...register("comment")}
        />
        <span className={classes.placeholder}>enter comment here</span>
      </label>
      <input type="submit" className={classes.submit} />
    </form>
  );
};

export default Form;
