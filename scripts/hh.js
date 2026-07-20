const originalStdoutWrite = process.stdout.write.bind(process.stdout);

let activeIntercept = false;
let taskOutput = '';

const intercept =() => {
  if (activeIntercept) {
    throw new Error('Unexpected initilization of multiple concurrent stdout interceptors.');
  }

  // $FlowFixMe
  process.stdout.write = (chunk, encoding, callback) => {
    if (activeIntercept && typeof chunk === 'string') {
      taskOutput += chunk;
    }
//console.clear()
//if(chunk.includes('1'))
    return originalStdoutWrite(chunk, encoding, callback);
  };

  activeIntercept = true;

  return () => {
    const result = taskOutput;

    activeIntercept = false;
    taskOutput = '';

    return result;
  };
};

const flush = intercept();

// This will get captured.
console.log('foo 0');
process.stdout.write('foo 1');

// This will not get captured.
//log('bar');

console.log(flush());
process.stdout.write('foo 5');


