import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function SkeletonLoading({count}) {
  return Array(count).fill(0).map((item, i) => {
    return (
    <SkeletonTheme className="border" key={i} baseColor="#202020" highlightColor="#444">
        <div className='max-w-[390px] mx-auto py-4'>
            <div className='flex'>
                <p>
                    <Skeleton circle width={40} height={40} />
                </p>
                <p className="ml-4 mt-2">
                    <div className='flex gap-2'>
                        <Skeleton width={120} />
                        <Skeleton width={30} />
                    </div>
                    <Skeleton width={60} />
                </p>
            </div>
            <div className='w-full mt-2'>
                <Skeleton height={300} />
            </div>
            <div className='w-full mt-2'>
                <Skeleton width={120} />
            </div>
        </div>
    </SkeletonTheme>
    )
  })
}
