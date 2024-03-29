import { NextPage } from "next";
import { trpc } from "~/utils/trpc";
import { DefaultLayout } from "~/components/DefaultLayout";
import { useSession, signIn, signOut } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spinner, Tooltip } from "@chakra-ui/react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "@emotion/styled";

interface TranslationDataInterface {
  data: {
    id: string;
    score: number;
    master: boolean;
    wordData: KanbanPageProps;
  }[];
  status: "error" | "idle" | "loading" | "success";
}

interface KanbanPageProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  searchingWord: string;
  searchingEngine: string;
  translations: {
    pos?: string;

    orig?: string;
    trans?: string;
    terms?: {
      name?: string;
    }[];
    entries?: {
      word?: string;
      score?: number;
      reverse_translations?: { name?: string }[];
    }[];
  }[];
}

interface StateInterface {
  noob?: {
    wordData: KanbanPageProps;
    id: string;
    score: number;
    master: boolean;
  }[];
  master?: {
    wordData: KanbanPageProps;
    id: string;
    score: number;
    master: boolean;
  }[];
}

const Home: NextPage = () => {
  const sessionInfo = useSession();
  useEffect(() => {
    console.log("useEffect");
  }, []);
  console.log(sessionInfo);
  return (
    <DefaultLayout>
      <div className="bg-slate-100 h-screen w-screen overflow-hidden flex flex-col">
        <header className="grid grid-cols-12 gap-4 py-3">
          {sessionInfo.status === "unauthenticated" ? (
            <div
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white col-start-12 m-auto"
              onClick={() => {
                signIn();
              }}
            ></div>
          ) : (
            <motion.img
              onClick={() => {
                signOut();
                // router.replace("/");
              }}
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white col-start-12 m-auto"
              src="https://ipfs.io/ipfs/QmZsKMi9GQ9SeGk5Y7cMcPqayzGa8YVbjTKCdtUYFJYijD?filename=%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220716225716.jpg"
            />
          )}
        </header>

        {sessionInfo.status === "loading" ? (
          <Spinner
            className="m-auto"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : sessionInfo.status === "authenticated" ? (
          <ContentComponent sessionInfo={sessionInfo} />
        ) : (
          <></>
        )}
      </div>
    </DefaultLayout>
  );
};

const DropLayout = styled.section<{
  isDraggingOver: boolean;
}>`
  background-image: ${(props) =>
    props.isDraggingOver ? "lightblue" : "lightgrey"};
`;

const DropContent = styled.div``;

const ContentComponent: FC<{
  sessionInfo: {
    data: any;
    status: any;
  };
}> = ({ sessionInfo }) => {
  // const utils = trpc.useContext();

  const { data, status } = trpc.useQuery([
    "wordCard.allVoc",
    {
      email: sessionInfo.data.user.email as string,
    },
  ]) as TranslationDataInterface;

  const updateMaster = trpc.useMutation(["wordCard.updateMaster"], {
    async onSuccess() {
      console.log("succes");
      // await utils.invalidateQueries(["wordCard.allVoc"]);
    },
  });

  const [state, setState] = useState<StateInterface>({
    noob: data ? data.filter((item) => !item.master) : undefined,
    master: data ? data.filter((item) => item.master) : undefined,
  });
  // console.log(state);

  const move = async (
    source: StateInterface["noob" | "master"],
    destination: any,
    droppableSource: { index: number; droppableId: keyof StateInterface },
    droppableDestination: { index: number; droppableId: keyof StateInterface }
  ): Promise<StateInterface> => {
    const sourceClone = Array.from(source!);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    // debugger;

    destClone.splice(droppableDestination.index, 0, removed);

    // if (removed.master) {

    await updateMaster.mutate({
      id: removed.id,
      master: !removed.master,
      email: sessionInfo.data.user.email as string,
    });

    console.log(removed.id);
    return {
      [droppableSource.droppableId]: sourceClone,
      [droppableDestination.droppableId]: destClone,
    };
  };

  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  useEffect(() => {
    if (status === "success") {
      setState({
        master: data.filter((item) => item.master && item.wordData),
        noob: data.filter((item) => !item.master && item.wordData),
      });
    }
  }, [data, status]);
  return (
    <article className="h-full w-full flex flex-row justify-between items-center px-9 flex-1 mb-4">
      {status === "success" ? (
        <DragDropContext
          onDragEnd={async (result) => {
            const { source, destination } = result;
            // dropped outside the list
            if (!destination) {
              return;
            }
            const sourceDrop = source.droppableId as "noob" | "master";
            const destinationDrop = destination.droppableId as
              | "noob"
              | "master";

            if (sourceDrop === destinationDrop) {
              const items = reorder(
                state[sourceDrop],
                source.index,
                destination.index
              );

              setState({
                ...state,
                [sourceDrop]: items,
              });
            } else {
              const result = await move(
                state[sourceDrop],
                state[destinationDrop],
                source as any,
                destination as any
              );
              setState({
                [sourceDrop]: result[sourceDrop],
                [destinationDrop]: result[destinationDrop],
              });
            }
          }}
        >
          <Droppable
            droppableId="noob"
            direction="horizontal"
            // type="column"
          >
            {({ innerRef, droppableProps, placeholder }, _snapshot) => (
              <DropLayout
                ref={innerRef}
                isDraggingOver
                className="w-5/12 h-full bg-white rounded-lg shadow-xl shadow-white-500/50"
                {...droppableProps}
              >
                {state?.noob?.map((column, index) => (
                  <Draggable
                    key={column.id}
                    draggableId={column.id}
                    index={index}
                  >
                    {(
                      { innerRef, draggableProps, dragHandleProps },
                      snapshot
                    ) => (
                      <DropContent
                        key={index}
                        ref={innerRef}
                        className="bg-zinc-300 rounded-sm float-left ml-2 mt-2 px-2 text-zinc-50"
                        {...draggableProps}
                        {...dragHandleProps}
                        style={{
                          userSelect: "none",
                          background: snapshot.isDragging
                            ? "lightgreen"
                            : "grey",
                          ...draggableProps.style,
                        }}
                      >
                        <Tooltip
                          bg="#ff4154"
                          label={column.wordData.translations.map((item) =>
                            item.trans
                              ? item.trans + ";"
                              : item.terms?.map((term) => term.name + "; ")
                          )}
                          aria-label="A tooltip"
                        >
                          <span>{column.wordData.searchingWord}</span>
                        </Tooltip>
                      </DropContent>
                    )}
                  </Draggable>
                ))}
                {placeholder}
              </DropLayout>
            )}
          </Droppable>

          <Droppable
            droppableId="master"
            direction="horizontal"
            // type="column"
          >
            {({ innerRef, droppableProps, placeholder }, _snapshot) => (
              <DropLayout
                ref={innerRef}
                isDraggingOver
                className="w-5/12 h-full bg-white rounded-lg shadow-xl shadow-white-500/50"
                {...droppableProps}
              >
                {state?.master?.map((column, index) => (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(
                      { innerRef, draggableProps, dragHandleProps },
                      snapshot
                    ) => (
                      <DropContent
                        key={index}
                        ref={innerRef}
                        className="bg-zinc-300 rounded-sm float-left ml-2 mt-2 px-2 text-zinc-50"
                        {...draggableProps}
                        {...dragHandleProps}
                        style={{
                          userSelect: "none",
                          background: snapshot.isDragging
                            ? "lightgreen"
                            : "grey",
                          ...draggableProps.style,
                        }}
                      >
                        <Tooltip
                          hasArrow
                          bg="#ff4154"
                          label={column.wordData.translations.map((item) =>
                            item.terms?.map((term) => term.name + "; ")
                          )}
                          aria-label="A tooltip"
                        >
                          <span>{column.wordData.searchingWord}</span>
                        </Tooltip>
                      </DropContent>
                    )}
                  </Draggable>
                ))}
                {placeholder}
              </DropLayout>
            )}
          </Droppable>
        </DragDropContext>
      ) : null}
    </article>
  );
};

export default Home;
