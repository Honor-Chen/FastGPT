import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { serviceSideProps } from '@fastgpt/web/common/system/nextjs';
import Loading from '@fastgpt/web/components/common/MyLoading';

const index = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/app/list');
  }, [router]);
  return <Loading></Loading>;
};

export async function getServerSideProps(content: any) {
  return {
    props: {
      ...(await serviceSideProps(content))
    }
  };
}
export default index;
