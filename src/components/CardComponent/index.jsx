const CardComponent = ({roomsData }) => {
  const cards = [
    {
      color: "#D3FFF7",
      description: `تماس ${roomsData.total}`,
      title: "کل تماس ها",
      imgIcon: "/dashboard/CallWite.svg",
    },
    {
      color: "#FFF2CC",
      description: `${roomsData.in_progress} نفر`,
      title: "در حال مکالمه",
      imgIcon: "/dashboard/History.svg",
    },
    {
      color: "#EDD6FF",
      description: `${roomsData.total_duration} دقیقه`,
      title: "زمان کل مکالمات",
      imgIcon: "/dashboard/Phone.svg",
    },
    {
      color: "#F5C0C0",
      description: `${roomsData.rejected} تماس`,
      title: "تماس از دست رفته",
      imgIcon: "/dashboard/Time.svg",
    },
  ];
  return (
    <div className="flex flex-wrap items-center my-6 gap-9 px-6 sm:px-20">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex-grow p-6 rounded-md flex"
          style={{ backgroundColor: card.color }}
        >
          <div>
            <img src={card.imgIcon} alt="notFound" />
            <div className="text-2xl mt-6">{card.title}</div>
          </div>

          <div className="text-lg mr-auto flex items-center">
            {card.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardComponent;
