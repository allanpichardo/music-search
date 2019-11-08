




def save_mfcc_image(y, sr, final_path):
    import librosa.feature
    mfccs = librosa.feature.mfcc(y=y, sr=sr, htk=True, n_mfcc=10)

    import matplotlib.pyplot as plt
    from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
    import librosa.display

    fig = plt.Figure()
    canvas = FigureCanvas(fig)
    ax = fig.add_subplot(111)
    fig.subplots_adjust(left=0,right=1,bottom=0,top=1)
    ax.set_axis_off()
    p = librosa.display.specshow(mfccs, ax=ax, y_axis=None, x_axis=None)
    fig.savefig(final_path, dpi=10, bbox_inches='tight', transparent=True, pad_inches=0.0, frameon='false')

if __name__=='__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Extracts an MFCC image from an audio file.')
    parser.add_argument('infile', help='The sound file to extract from')
    parser.add_argument('outfile', help='The output file path')
    args = vars(parser.parse_args())

    infile = args['infile']

    import urllib.parse
    is_temporary = False
    if urllib.parse.urlparse(infile).scheme in ('http', 'https',):
        is_temporary = True
        import io
        import time
        import urllib.request
        millis = int(round(time.time() * 1000000))
        g = io.BytesIO(urllib.request.urlopen(infile).read())
        temporarylocation="{}.mp3".format(millis)
        with open(temporarylocation,'wb') as out: ## Open temporary file as bytes
            out.write(g.read())                ## Read bytes into file
        infile = temporarylocation

    outfile = args['outfile']

    import librosa

    duration = librosa.get_duration(filename=infile)
    y, sr = librosa.load(infile, offset=(duration*0.33), duration=20)

    if len(y) == 0:
        raise RuntimeError('Error reading sound file')

    save_mfcc_image(y, sr, outfile)

    if is_temporary:
        import os
        os.remove(infile)