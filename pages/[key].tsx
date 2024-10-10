import { getOS } from "@/utils/os";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import links from "../utils/links";

interface PageProps {
	linkObj: any; // Можно уточнить типизацию в зависимости от вашей структуры данных
}

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = links.map(link => ({
		params: { key: link.key },
	}));

	return {
		paths,
		fallback: false, // Если true, то страницы будут генерироваться по запросу
	};
};

export const getStaticProps: GetStaticProps<PageProps> = async context => {
	const { key } = context.params!;

	const linkObj = links.find(link => link.key === key);

	if (!linkObj) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			linkObj,
		},
	};
};

const RedirectPage = ({ linkObj }: PageProps) => {
	const router = useRouter();
	const [unsupported, setUnsupported] = useState<boolean>(false);

	useEffect(() => {
		if (linkObj.type === "single") {
			// Перенаправляем на единственную ссылку
			router.replace(linkObj.link);
		} else if (linkObj.type === "multi_platform") {
			let platform: string = getOS();

			const destination = linkObj[platform];

			if (destination) {
				// Перенаправляем на соответствующую платформу
				router.replace(destination);
			} else {
				// Если платформа не поддерживается, перенаправляем на страницу ошибки или другую ссылку
				setUnsupported(true);
			}
		}
	}, [linkObj, router]);

	if (unsupported) {
		return <h1>Платформа не поддерживается</h1>;
	}

	return null; // Компонент ничего не отображает, так как происходит перенаправление
};

export default RedirectPage;
