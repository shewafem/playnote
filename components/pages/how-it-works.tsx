import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface FeatureProps {
  icon: string,
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: "/benefit.png",
    title: "Доступность обучения",
    description:
      "Наши уроки подходят для всех - от новичков до опытных гитаристов. Простые объяснения и пошаговые инструкции помогут быстро освоить инструмент.",
  },
  {
    icon: "/benefit.png",
    title: "Живое сообщество",
    description:
      "Присоединяйтесь к нашему чату гитаристов, где можно обмениваться опытом, задавать вопросы и находить единомышленников для совместных джемов.",
  },
  {
    icon: "/benefit.png",
    title: "Прогрессивная система",
    description:
      "Обучение строится от простого к сложному. По мере роста вашего мастерства будут открываться новые уровни и техники игры.",
  },
  {
    icon: "/benefit.png",
    title: "Игровая мотивация",
    description:
      "Система достижений, рейтинги и награды превращают обучение в увлекательную игру. Соревнуйтесь с другими учениками и отслеживайте свой прогресс!",
  },
];

const HowItWorks =  () => {
  return (
    <section
      id="howItWorks"
      className="flex flex-col justify-center items-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl mb-8 font-bold ">
        Как это{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          работает
        </span>?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 text-xl place-items-center">
                {title}
                <Image alt="reward" width={100} height={100} src={icon}></Image>
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks