import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import { addFiles, removeFile, uploadFilesAsync } from '../redux/fileUploaderSlice';
import pdfLogo from '../assets/pfd_logo.png';
import './FileUploader.sass';

const FileUploader = () => {
  const files = useSelector((state) => state.fileUploader.files);
  const dispatch = useDispatch();
  const generatedText = useSelector((state) => state.fileUploader.generatedText);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*, application/pdf', // Accept PDF files
    onDrop: acceptedFiles => {
      dispatch(addFiles(acceptedFiles.map(file => ({
        file, // Keep a reference to the original File object
        name: file.name,
        preview: URL.createObjectURL(file)
      }))));
    }
  });


  const truncateFileName = (name) => {
    if (name.length > 40) {
      return name.substring(0, 10) + '...' + name.substring(name.length - 10, name.length);
    }
    return name;
  }

  const thumbs = [
    <div key="label" className="label"></div>,
    ...files.map(file => (
      <div className="thumb" key={file.name}>
        <img
          src={file.name.toLowerCase().endsWith('.pdf') ? pdfLogo : file.preview} // Conditionally render the image source
          className="img"
          alt="preview"
        />
        <div className="fileName">{truncateFileName(file.name)}</div>
        <button className="removeButton" onClick={() => dispatch(removeFile(file))}>x</button>
      </div>
    ))
  ];

  const GeneratedText = ({ text }) => {
    // Extract the text before and after the code
    const [beforeCode, code, afterCode] = text.split(/```html([\s\S]*?)```/);

    // Create a new blob object
    const blob = new Blob([code], { type: 'text/html' });

    // Create a URL for the blob object
    const url = URL.createObjectURL(blob);

    return (
      <div className="generatedTextContainer">
        <p>{beforeCode}</p>
        <iframe src={url} title="Chart" />
        <p>{afterCode}</p>
      </div>
    );
  }

  // Effect to revoke object URL
  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {thumbs.length > 1 && (
        <aside className="thumbsContainer">
          <ul className='thumbsList'>{thumbs}</ul>
        </aside>
      )}
      {thumbs.length > 1 && (
        <button className="submitButton" onClick={() => dispatch(uploadFilesAsync(files))}>Submit</button>
      )}
      {generatedText ? <GeneratedText text={generatedText} /> : null}
    </section>
  );
}

export default FileUploader;
