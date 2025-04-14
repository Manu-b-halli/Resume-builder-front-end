import React, { useContext, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { LayoutGrid } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from './../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

function ThemeColor() {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
    "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF5733",
    "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF",

    // New colors added
    "#4CAF50", "#2196F3", "#81C784", "#64B5F6", "#00BCD4",
    "#AED581", "#F06292", "#BA68C8", "#CE93D8", "#FFB6C1",
    "#E1BEE7", "#FFB74D", "#FFA726", "#FFD180", "#FFE082",
    "#F0B27A", "#90A4AE", "#78909C", "#009688", "#26A69A",
    "#B0BEC5", "#F5F5F5", "#E0F7FA", "#FFF3E0", "#E8F5E9", "#F3E5F5"

    
  ]

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [selectedColor, setSelectedColor] = useState();
  const { resumeId } = useParams();
  const onColorSelect = (color) => {
    setSelectedColor(color)
    setResumeInfo({
      ...resumeInfo,
      themeColor: color
    });
    const data = {
      data: {
        themeColor: color
      }
    }
    GlobalApi.UpdateResumeDetail(resumeId, data).then(resp => {
      console.log(resp);
      toast('Theme Color Updated')
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm"
          className="flex gap-2" > <LayoutGrid /> Theme</Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className='mb-2 text-sm font-bold'>Select Theme Color</h2>
        <div className='grid grid-cols-5 gap-3'>
          {colors.map((item, index) => (
            <div
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer
             hover:border-black border
             ${selectedColor == item && 'border border-black'}
             `}
              style={{
                background: item
              }}>

            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ThemeColor