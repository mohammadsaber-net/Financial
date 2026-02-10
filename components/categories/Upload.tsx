import {useCSVReader} from 'react-papaparse'
import { Button } from '../ui/button'
import { Upload } from 'lucide-react'
type Props={
    onUpload:(results:any)=>void
}
export default function UploadButton({onUpload}:Props) {
    const {CSVReader}=useCSVReader()
  return (
    <CSVReader>
        {({getProps}:any)=>(
            <Button
            {...getProps}
            >
                <Upload className="size-4 mr-2"/> Import
            </Button>
        )}
    </CSVReader>
  )
}
