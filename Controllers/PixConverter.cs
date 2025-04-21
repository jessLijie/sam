using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using Tesseract;
using Emgu.CV;
using Emgu.CV.Structure;
using Emgu.CV.CvEnum;
public static class PixConverter
{
    public static Pix ToPix(Bitmap image)
    {
        using (var stream = new MemoryStream())
        {
            image.Save(stream, System.Drawing.Imaging.ImageFormat.Tiff);
            stream.Position = 0;
            return Pix.LoadTiffFromMemory(stream.ToArray());
        }
    }

 

}
