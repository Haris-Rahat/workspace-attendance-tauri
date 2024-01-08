import { Dispatch, SetStateAction, useState } from "react";
import { AlertDialogContent } from "../../../components/ui/alert-dialog";
import {
  Cross1Icon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@radix-ui/react-icons";
import { Button } from "../../../components/ui/button";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS_AND_TASKS_QUERY } from "../../../services/queries/projectsAndTasks";
import { useHookstate } from "@hookstate/core";
import {
  ProjectAndTaskIdState,
  UserState,
} from "../../../services/state/globalState";
import { IProject, IProjectList, ITask } from "../../../@types/types";
import { cn } from "../../../lib/utils";

const ProjectsAndTasks: React.FC<{
  setToggleProjects: Dispatch<SetStateAction<boolean>>;
  employeeId: string;
  clockInEmployee: () => void;
}> = ({ employeeId, setToggleProjects, clockInEmployee }) => {
  const userState = useHookstate(UserState);
  const projectAndTaskIdState = useHookstate(ProjectAndTaskIdState);
  const [toggleTasks, setToggleTasks] = useState(false);
  const [projectId, setProjectId] = useState("");

  const { data, error, loading } = useQuery<{ projectsByUser: IProjectList }>(
    GET_PROJECTS_AND_TASKS_QUERY,
    {
      variables: {
        userId: employeeId,
      },
      context: {
        headers: {
          database: userState.domain.get(),
        },
      },
    }
  );

  const Render = () => {
    if (loading) return <div>Loading....</div>;
    if (error) return <div>Error!</div>;
    return (
      <div className={"w-full"}>
        <p className={"text-lg mb-6"}>
          Your {!toggleTasks ? "Projects" : "Tasks"}
        </p>
        {data?.projectsByUser.length ? (
          !toggleTasks ? (
            data?.projectsByUser.map((project: IProject, index: number) => (
              <Button
                onClick={() => {
                  if (project.tasks.length > 0) {
                    setProjectId((_) => project.id);
                    setToggleTasks((prev) => !prev);
                    return;
                  }
                  projectAndTaskIdState.set((prev) => ({
                    ...prev,
                    projectId: project.id,
                  }));
                  clockInEmployee();
                  setToggleProjects(false);
                  return;
                }}
                className={"w-full cursor-pointer h-16 my-2"}
                asChild={true}
                variant={"outline"}
                key={index}
              >
                <div className={"flex flex-row justify-between items-center"}>
                  <p className={"text-xl"}>{project?.name}</p>
                  {project?.tasks.length > 0 && (
                    <ChevronRightIcon className={"w-6 h-6"} />
                  )}
                </div>
              </Button>
            ))
          ) : (
            data?.projectsByUser
              .filter((project: IProject) => project?.id === projectId)[0]
              .tasks.map((task: ITask, index: number) => (
                <Button
                  onClick={() => {
                    projectAndTaskIdState.set((prev) => ({
                      ...prev,
                      projectId: projectId,
                      taskId: task.id,
                    }));
                    clockInEmployee();
                    setToggleProjects(false);
                    return;
                  }}
                  className={
                    "w-full cursor-pointer h-16 my-2 justify-start text-xl"
                  }
                  variant={"outline"}
                  key={index}
                >
                  {task?.task}
                </Button>
              ))
          )
        ) : (
          <p>You don't have any projects</p>
        )}
      </div>
    );
  };

  return (
    <AlertDialogContent className={"bg-slate-900"}>
      <div
        className={cn(
          "flex",
          toggleTasks && "justify-between",
          !toggleTasks && "justify-end"
        )}
      >
        {toggleTasks && (
          <Button size={"icon"} variant={"ghost"}>
            <ChevronLeftIcon
              className={"w-6 h-6"}
              onClick={() => setToggleTasks(false)}
            />
          </Button>
        )}
        <Button size={"icon"} variant={"default"}>
          <Cross1Icon
            className={"w-6 h-6"}
            onClick={() => setToggleProjects(false)}
          />
        </Button>
      </div>
      <Render />
    </AlertDialogContent>
  );
};

export default ProjectsAndTasks;
