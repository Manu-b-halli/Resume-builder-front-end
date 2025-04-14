// import React, { useEffect, useState } from 'react'
// import AddResume from './components/AddResume'
// import { useUser } from '@clerk/clerk-react'
// import GlobalApi from './../../service/GlobalApi';
// import ResumeCardItem from './components/ResumeCardItem';

// function Dashboard() {

//   const {user}=useUser();
//   const [resumeList,setResumeList]=useState([]);
//   useEffect(()=>{
//     user&&GetResumesList()
//   },[user])

//   /**
//    * Used to Get Users Resume List
//    */
//   const GetResumesList=()=>{
//     GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
//     .then(resp=>{
//       console.log(resp.data.data)
//       setResumeList(resp.data.data);
//     })
//   }
//   return (
//     <div className='p-10 md:px-20 lg:px-32'>
//       <h2 className='font-bold text-3xl'>My Resume</h2>
//       <p>Start Creating your Resume</p>
//       <div className='grid grid-cols-2 
//       md:grid-cols-3 lg:grid-cols-5 gap-5
//       mt-10
//       '>
//         <AddResume/>
//         {resumeList?.length > 0 ? resumeList.map((resume, index) => (
//           <ResumeCardItem resume={resume} key={index} refreshData={GetResumesList} />
//         )):
//         [1,2,3,4].map((item,index)=>(
//           <div className='h-[280px] rounded-lg bg-slate-200 animate-pulse'>
//           </div>
//         ))
//         }
//       </div>
//     </div>
//   )
// }

// export default Dashboard


// src/dashboard/index.jsx


// import React, { useEffect, useState } from 'react'
// import AddResume from './components/AddResume'
// import { useUser } from '@clerk/clerk-react'
// import GlobalApi from './../../service/GlobalApi';
// import ResumeCardItem from './components/ResumeCardItem';
// import { 
//   DndContext, 
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragOverlay
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   rectSortingStrategy,
//   useSortable
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// function Dashboard() {
//   const { user } = useUser();
//   const [resumeList, setResumeList] = useState([]);
//   const [activeId, setActiveId] = useState(null);

//   // Configure sensors for drag detection
//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 8, // Minimum distance before a drag starts
//       },
//     }),
//     useSensor(KeyboardSensor)
//   );

//   useEffect(() => {
//     user && GetResumesList();
//   }, [user]);

//   /**
//    * Used to Get Users Resume List
//    */
//   const GetResumesList = () => {
//     GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
//       .then(resp => {
//         console.log(resp.data.data);
//         setResumeList(resp.data.data);
//       })
//       .catch(error => {
//         console.error("Error fetching resumes:", error);
//       });
//   };

//   const handleDragStart = (event) => {
//     setActiveId(event.active.id);
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     setActiveId(null);

//     if (!over) return;

//     if (active.id !== over.id) {
//       setResumeList((items) => {
//         const oldIndex = items.findIndex(item => item.id === active.id);
//         const newIndex = items.findIndex(item => item.id === over.id);

//         if (oldIndex !== -1 && newIndex !== -1) {
//           const reorderedList = arrayMove(items, oldIndex, newIndex);

//           // Save the new order to the backend
//           saveResumeOrder(reorderedList);

//           return reorderedList;
//         }
//         return items;
//       });
//     }
//   };

//   const saveResumeOrder = async (orderedList) => {
//     try {
//       const orderData = orderedList.map((resume, index) => ({
//         id: resume.id,
//         position: index,
//         userEmail: user?.primaryEmailAddress?.emailAddress
//       }));

//       console.log("Saving resume order:", orderData);
//       await GlobalApi.UpdateResumeOrder(orderData);
//     } catch (error) {
//       console.error("Error saving resume order:", error);
//     }
//   };

//   return (
//     <div className='p-10 md:px-20 lg:px-32'>
//       <h2 className='font-bold text-3xl'>My Resume</h2>
//       <p>Start Creating your Resume</p>

//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragStart={handleDragStart}
//         onDragEnd={handleDragEnd}
//       >
//         <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10'>
//           <AddResume />

//           {resumeList?.length > 0 ? (
//             <SortableContext 
//               items={resumeList.map(resume => resume.id)} 
//               strategy={rectSortingStrategy}
//             >
//               {resumeList.map((resume) => (
//                 <SortableResumeCardItem 
//                   key={resume.id}
//                   resume={resume}
//                   refreshData={GetResumesList}
//                 />
//               ))}
//             </SortableContext>
//           ) : (
//             // Skeleton loading UI
//             [1, 2, 3, 4].map((item, index) => (
//               <div key={index} className='h-[280px] rounded-lg bg-slate-200 animate-pulse'>
//               </div>
//             ))
//           )}
//         </div>

//         <DragOverlay>
//           {activeId ? (
//             <div className="opacity-80">
//               {resumeList.find(resume => resume.id === activeId) && (
//                 <ResumeCardItem 
//                   resume={resumeList.find(resume => resume.id === activeId)}
//                   refreshData={GetResumesList}
//                   isDragging={true}
//                 />
//               )}
//             </div>
//           ) : null}
//         </DragOverlay>
//       </DndContext>
//     </div>
//   );
// }

// // Create a Sortable wrapper for the ResumeCardItem
// function SortableResumeCardItem(props) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging
//   } = useSortable({ 
//     id: props.resume.id,
//     data: props.resume
//   });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.3 : 1,
//     zIndex: isDragging ? 1 : 0,
//     position: 'relative'
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <ResumeCardItem {...props} />
//     </div>
//   );
// }

// export default Dashboard;




// // src/dashboard/index.jsx - FINAL VERSION
// import React, { useEffect, useState } from 'react';
// import AddResume from './components/AddResume';
// import { useUser } from '@clerk/clerk-react';
// import GlobalApi from './../../service/GlobalApi';
// import ResumeCardItem from './components/ResumeCardItem';
// import { 
//   DndContext, 
//   closestCenter,
//   useSensor,
//   useSensors,
//   PointerSensor,
//   KeyboardSensor
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   rectSortingStrategy
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// function Dashboard() {
//   const { user } = useUser();
//   const [resumeList, setResumeList] = useState([]);

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: { distance: 8 }
//     }),
//     useSensor(KeyboardSensor)
//   );

//   useEffect(() => {
//     user && GetResumesList();
//   }, [user]);

//   const GetResumesList = () => {
//     GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
//       .then(resp => {
//         console.log(resp.data.data);
//         setResumeList(resp.data.data);
//       })
//       .catch(error => {
//         console.error("Error fetching resumes:", error);
//       });
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;

//     if (over && active.id !== over.id) {
//       setResumeList((items) => {
//         const oldIndex = items.findIndex(item => item.id === active.id);
//         const newIndex = items.findIndex(item => item.id === over.id);

//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   };

//   return (
//     <div className='p-10 md:px-20 lg:px-32'>
//       <h2 className='font-bold text-3xl'>My Resume</h2>
//       <p>Start Creating your Resume</p>

//       <div className='text-blue-700 bg-blue-50 p-3 my-4 rounded-md'>
//         Drag resumes to reorder them. The order will be saved.
//       </div>

//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragEnd={handleDragEnd}
//       >
//         <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10'>
//           <AddResume />

//           {resumeList?.length > 0 ? (
//             <SortableContext 
//               items={resumeList.map(resume => resume.id)} 
//               strategy={rectSortingStrategy}
//             >
//               {resumeList.map((resume) => (
//                 <SortableItem
//                   key={resume.id}
//                   id={resume.id}
//                 >
//                   <ResumeCardItem
//                     resume={resume}
//                     refreshData={GetResumesList}
//                   />
//                 </SortableItem>
//               ))}
//             </SortableContext>
//           ) : (
//             [1, 2, 3, 4].map((item, index) => (
//               <div key={index} className='h-[280px] rounded-lg bg-slate-200 animate-pulse'>
//               </div>
//             ))
//           )}
//         </div>
//       </DndContext>
//     </div>
//   );
// }

// // This is the simplest SortableItem implementation
// function SortableItem(props) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id: props.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     cursor: 'grab',
//     position: 'relative',
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {props.children}
//     </div>
//   );
// }

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddResume from './components/AddResume';
import { useUser } from '@clerk/clerk-react';
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';

// import { extractTextFromPDF, parseResumeFromText } from 'scr/lib/utils';
import { toast } from 'sonner';
import PDFImporter from '@/components/PDFImporter';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && GetResumesList();
  }, [user]);


  const GetResumesList = () => {
    setLoading(true);

    // Clear any previous error state if you have one
    // setError(null);

    console.log("Fetching resumes for user:", user?.primaryEmailAddress?.emailAddress);

    GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
      .then(resp => {
        console.log("Resume data received:", resp.data);
        if (resp.data && resp.data.data) {
          setResumeList(resp.data.data);
        } else {
          console.warn("Unexpected API response format:", resp.data);
          setResumeList([]);
        }
      })
      .catch(error => {
        console.error("Error fetching resumes:", error);
        // If you have an error state: setError(error.message);
        setResumeList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // Handle PDF import
  const handlePDFSelect = async (file) => {
    try {
      toast.info(`Processing PDF: ${file.name}...`);

      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file);

      // Parse the text into resume sections
      const resumeData = parseResumeFromText(extractedText);

      // For now, just show what we'd do with the data
      console.log("Parsed resume data:", resumeData);
      toast.success("PDF processed successfully!");

      // In a real implementation, you would create a new resume with this data
      // For example:
      // createResumeFromPDF(resumeData);
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast.error("Failed to process PDF");
    }
  };

  // Create resume from processed PDF
  const createResumeFromPDF = (resumeData) => {
    // This would create a new resume with the extracted data
    // For now, it's just a placeholder
    console.log("Would create resume with:", resumeData);
  };

  // Handle drag end - reordering resumes
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) return;

    // Reorder the list
    const items = Array.from(resumeList);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setResumeList(items);

    // Update resume order in backend
    updateResumeOrder(items);
  };

  // Save the new resume order to backend
  const updateResumeOrder = (orderedList) => {
    // This is a placeholder - in a real implementation, you would
    // call your API to save the new order
    console.log("Saving new resume order:", orderedList.map(item => item.id));

    // GlobalApi.UpdateResumeOrder(orderedList.map((item, index) => ({
    //   id: item.id,
    //   position: index
    // })));
  };

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start Creating your Resume</p>

      <div className='bg-white p-4 my-4 border rounded-lg'>
        <p className="text-gray-600">
          Drag resumes to reorder them.
        </p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="resumes" direction="horizontal">
          {(provided) => (
            <div
              className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-6'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* Static elements - not draggable */}
              <div className="non-draggable-item">
                <AddResume />
              </div>

              <PDFImporter />

              

              {/* Draggable resume cards */}
              {!loading && resumeList?.length > 0 ? (
                resumeList.map((resume, index) => (
                  <Draggable
                    key={resume.id || index}
                    draggableId={String(resume.id || index)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1
                        }}
                      >
                        <ResumeCardItem
                          resume={resume}
                          refreshData={GetResumesList}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              ) : loading ? (
                // Loading skeletons
                [1, 2, 3, 4].map((item, index) => (
                  <div key={`skeleton-${index}`} className='h-[280px] rounded-lg bg-slate-200 animate-pulse'>
                  </div>
                ))
              ) : null}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Dashboard;