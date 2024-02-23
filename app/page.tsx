"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { Plugin, PluginOptions } from 'grapesjs';
import LoaderIcon from '@/components/LoaderIcon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface GrapesjsMJMLPlugin extends Plugin<PluginOptions> {
  grapesjsMJML: Plugin<PluginOptions>;
}

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<Editor>();
  const [csvFile, setCsvFile] = useState<null | File>(null);
  const [emailFrom, setEmailFrom] = useState<string>();
  const [subject, setSubject] = useState<string>();
  const [variables, setVariables] = useState<string[]>();
  const [isVariableLoading, setIsVariableLoading] = useState<boolean>(false);
  const [isSendingMail, setIsSendingMail] = useState<boolean>(false);
  const [showDateTime, setShowDateTime] = useState(false);

  const [dateTime, setDateTime] = useState(['', '']);
  const [scheduleDate, setScheduleDate] = useState('')

  const initializeGrapesJS = async () => {
    if (typeof window !== 'undefined') {
      const grapesjsModule = await import('grapesjs');
      const mjmlModule = await import('grapesjs-mjml')
      const grapesjsMJML = (mjmlModule as unknown as GrapesjsMJMLPlugin);

      const emailEditor = grapesjsModule.default.init({
        container: '#email-editor',

        fromElement: true,
        avoidInlineStyle: false,
        plugins: [grapesjsMJML],

        height: '500px',

        // panels: {
        //   defaults: [],
        // },
      });
      const viewsPanel = emailEditor.Panels.getPanel('views');
      if (viewsPanel) {
        emailEditor.Panels.removePanel('views');
      }

      setEditor(emailEditor);
      emailEditor.addComponents(`
  <mjml>
      <mj-body>
          <mj-section><mj-text>Import your MJML file</mj-text></mj-section>
      </mj-body>
  </mjml>
  `)
    }
  }
  useEffect(() => {
    initializeGrapesJS();
  }, []);
  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Decode token
        const res: any = await axios.post('/api/verifyToken', { token: token })
        if (res.data.status === 200) {
          setLoading(false);
        }

      } catch (error) {
        console.error('Invalid token:', error);
        setLoading(false);
        router.push('/login');

      }
    };
    checkToken();
  }, []);




  const handleCSVChange = (event: any) => {
    setCsvFile(event.target.files[0]);
  };
  const handleEmailFromChange = (event: any) => {
    setEmailFrom(event.target.value)
  }
  const handleSubjectChange = (event: any) => {
    setSubject(event.target.value)
  }

  const handleUploadCSV = async (e: any) => {
    setIsSendingMail(true);
    e.preventDefault()
    try {
      let modifiedMJML = '';
      if (editor) {
        const innerHTML = editor.DomComponents?.getWrapper()?.view?.el.innerHTML;
        if (innerHTML !== undefined) {
          modifiedMJML = innerHTML
        }
      }
      const formData = new FormData();
      //Scheduler date
      if (showDateTime && dateTime) {
        formData.append('dateTime', scheduleDate);
      }
      if (csvFile && modifiedMJML && emailFrom && subject) {
        formData.append('emailFrom', emailFrom)
        formData.append('subject', subject)
        formData.append('csvFile', csvFile);
        formData.append('mjmlContent', modifiedMJML);
      } else {
        console.error("No file selected");
      }
      const response = await axios.post('/api/sendMail', formData);

      if (response) {
        toast.success("Email Sent !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      setIsSendingMail(false)
    } catch (error) {
      console.error('Error uploading CSV:', error);
      setIsSendingMail(false)
    }
  }
  const handleCheckboxChange = (e: any) => {
    setShowDateTime(e.target.checked);
  };
  const handleChange = (e: any) => {
    const selectedDateTime = new Date(e.target.value);
    const offset = selectedDateTime.getTimezoneOffset();

    selectedDateTime.setMinutes(selectedDateTime.getMinutes() - offset);

    // Extract date and time components
    const formattedDate = selectedDateTime.toISOString().slice(0, 10);
    const formattedTime = selectedDateTime.toISOString().slice(11, 16);
    // Update the state with the formatted date and time
    setDateTime([formattedDate, formattedTime]);
    setScheduleDate(selectedDateTime.toISOString());
  };

  useEffect(() => {
    if (csvFile) {
      setIsVariableLoading(true)
      const getVariable = async () => {
        try {
          const formData = new FormData();
          if (csvFile)
            formData.append('csvFile', csvFile);

          const response = await fetch('/api/getVariable', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            setVariables(data.result)
          }
          setIsVariableLoading(false)
        } catch (error) {
          setIsVariableLoading(false)
          console.error('Error uploading CSV:', error);
        }
      }
      getVariable();
    }
  }, [csvFile])
  const handleLogout = (name: string) => {
    Cookies.remove(name, { path: '/' });
    router.push('/login')
  };
  return (
    <div className='flex flex-col-reverse	'>
      <div id="email-editor" />

      {loading ? <div>Loading...</div> : <>
        <ToastContainer />
        <div className="block p-8 lg:py-8 lg:px-64 ">
          <div className='flex justify-between'>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-black">Batch Emailer</h5>
            <h5 className=' cursor-pointer' onClick={() => handleLogout('token')}>Logout</h5>
          </div>
          <form action="" encType='multipart/form-data'>
            <div className='mb-4'>
              <label
                htmlFor="from"
                className="block mb-2 text-sm font-medium text-black"
              >
                From
              </label>
              <input
                type="email"
                id="from"
                className="bg-white border text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 border-black placeholder-gray-400"
                placeholder="BVS@example.com"
                onChange={handleEmailFromChange}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor="subject"
                className="block mb-2 text-sm font-medium text-black"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="bg-white border text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 border-black placeholder-gray-400"
                placeholder="Hello from BVS"
                onChange={handleSubjectChange}
                required
              />
            </div>

            <input name='csvFile' type="file" accept=".csv" onChange={handleCSVChange} className='bg-white border text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 border-black placeholder-gray-400' />
            <div className="flex items-center my-4">
              <input
                id="default-checkbox"
                type="checkbox"
                defaultValue=""
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 "
                onChange={handleCheckboxChange}
                checked={showDateTime}
              />
              <label
                htmlFor="default-checkbox"
                className="ms-2 text-sm font-medium text-black"
              >
                Enable Scheduler
              </label>
            </div>
            {showDateTime && (
              <div className="block mb-4 w-[30%] bg-white">
                <input type="datetime-local" name="dateTime"
                  id="dateTime"
                  className='border border-black'
                  value={dateTime[0] + 'T' + dateTime[1]}
                  onChange={handleChange}
                />
              </div>
            )}

            <button
              className={`text-white ${csvFile && emailFrom && subject && !isSendingMail
                ? 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                : 'bg-gray-400 cursor-not-allowed'
                } font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 ${csvFile && emailFrom && subject && !isSendingMail ? 'bg-black hover:bg-white hover:text-black hover:border-black border' : 'bg-gray-600'
                } inline-flex items-center`}
              onClick={handleUploadCSV}
              disabled={!csvFile || !emailFrom || !subject}
            >
              {isSendingMail ? "Sending..." : "Send Mail"}
            </button>

            {variables ? <h5 className="my-4 text-2xl font-bold tracking-tight text-black">Available variable</h5>
              : ""}
            {isVariableLoading ? <LoaderIcon /> :
              !isVariableLoading && variables ? variables.map((variable, index) => {
                return (
                  <p key={index} className='text-black'>{`{${variable}}`}</p>
                )
              }) : <p className='text-black mt-4'>No variable available</p>
            }
          </form>

        </div>
      </>
      }
    </div>
  );
};