import { useState, useEffect } from 'react';

const makeCancelable = function makeCancelable(promise) {
  let isCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise()
      .then(val => {
        if (!isCanceled) {
          return resolve(val);
        }
        return true;
      })
      .catch(error => (isCanceled ? reject(new Error({ isCanceled })) : reject(error)));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
};
export default function usePromise(request) {
  const [loading, setLoading] = useState(false);
  const promise = makeCancelable(request);
  useEffect(
    () =>
      function cancel() {
        promise.cancel();
      },
    []
  );
  function fetchUser() {
    if (loading) {
      return Promise.resolve();
    }
    setLoading(true);
    promise.promise.then(
      val => {
        setLoading(false);
        return val;
      },
      error => {
        setLoading(false);
        return error;
      }
    );
    return promise.promise;
  }
  return { fetchUser, loading };
}
