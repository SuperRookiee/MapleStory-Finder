import { redirect } from "next/navigation";

const TodoListRedirectPage = () => {
    redirect("/todo_list/boss");
};

export default TodoListRedirectPage;
