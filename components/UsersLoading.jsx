import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function UsersLoading({count}) {
  return Array(count).fill(0).map((item, i) => {
    return (
    <SkeletonTheme className="border" key={i} baseColor="#202020" highlightColor="#444">
        <div className='max-w-[390px] mx-auto pt-4 bg-2 px-4'>
            <div className='flex'>
                <p>
                    <Skeleton circle width={40} height={40} />
                </p>
                <p className="ml-4 mt-2">
                    <Skeleton width={120} />
                    <Skeleton width={60} />
                </p>
            </div>
        </div>
    </SkeletonTheme>
    )
  })
}
